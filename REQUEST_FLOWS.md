# System Architecture and Request Flows

This document visualizes the entire request flow for the microservice architecture, including the Frontend, Backend, and multiple database instances (Neon PostgreSQL and two MongoDB instances).

## 1. Overall System Architecture

This diagram illustrates the macro-level architecture showing how the Frontend connects to the Backend, and how the Backend routes requests to the appropriate databases.

```mermaid
graph TD
    %% Define Nodes
    Client["Frontend Client\n(React, WebRTC, Socket.IO)"]
    
    subgraph Backend Node.js Microservice
        App["Express / Socket.IO Server"]
        AuthRoute["Auth / User Routes"]
        APIRoute["API & Config Routes"]
        RuntimeRoute["Runtime / Products Routes"]
        SandboxRoute["Sandbox Product Routes"]
    end
    
    subgraph Databases
        Neon[(Neon DB\nPostgreSQL)]
        Mongo1[(MongoDB 1\nAPI & OTP DB)]
        Mongo2[(MongoDB 2\nProducts DB)]
    end

    %% Connections
    Client -- HTTP & WebSocket --> App
    
    App --> AuthRoute
    App --> APIRoute
    App --> RuntimeRoute
    App --> SandboxRoute
    
    AuthRoute -- "User Auth, Profiles, Sessions" --> Neon
    AuthRoute -- "OTP Verification" --> Mongo1
    APIRoute -- "API Definitions & Config" --> Mongo1
    RuntimeRoute -- "Production Data" --> Mongo2
    SandboxRoute -- "Sandbox Data" --> Mongo2
    
    classDef frontend fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff;
    classDef backend fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff;
    classDef db fill:#f1c40f,stroke:#f39c12,stroke-width:2px,color:#000;
    
    class Client frontend;
    class App,AuthRoute,APIRoute,RuntimeRoute,SandboxRoute backend;
    class Neon,Mongo1,Mongo2 db;
```

## 2. Request Flows by Module

### 2.1 Authentication & Registration Flow

The registration and authentication flow uses both **MongoDB 1** (for temporary OTP storage) and **Neon DB (PostgreSQL)** (for permanent user records and session management).

```mermaid
sequenceDiagram
    box rgba(52, 152, 219, 0.15) Frontend
    participant C as Client
    end
    
    box rgba(46, 204, 113, 0.15) Backend (Express)
    participant S as Server
    end
    
    box rgba(241, 196, 15, 0.15) Databases
    participant M1 as MongoDB 1 (test db)
    participant N as Neon DB (PostgreSQL)
    end

    %% OTP Generation
    C->>S: POST /api/auth/send-otp
    S->>M1: Save OTP to OTP Collection
    M1-->>S: Success
    S-->>C: 200 OK (Sets session_token cookie)
    
    %% OTP Verification
    C->>S: POST /api/auth/verify-otp
    S->>M1: Verify OTP from DB
    M1-->>S: Valid
    S-->>C: 200 OK (Updates session_token to verified)
    
    %% Registration
    C->>S: POST /api/auth/register (Password)
    S->>N: Create User (Prisma)
    N-->>S: User Created
    S-->>C: 201 Created (Sets access_token & refresh_token)
    
    %% Login
    C->>S: POST /api/auth/login
    S->>N: Find User & Verify Password
    N-->>S: User Verified
    S-->>C: 200 OK (Sets access_token & refresh_token)
```

### 2.2 User Profile Flow

User-related data is completely handled by **Neon DB**.

```mermaid
sequenceDiagram
    box rgba(52, 152, 219, 0.15) Frontend
    participant C as Client
    end
    
    box rgba(46, 204, 113, 0.15) Backend (Express)
    participant Auth as Auth Middleware
    participant S as User Controller
    end
    
    box rgba(241, 196, 15, 0.15) Databases
    participant N as Neon DB (PostgreSQL)
    end

    C->>Auth: GET /api/users/profile (with access_token)
    Auth->>Auth: Verify JWT Token
    Auth->>S: Token Valid, Proceed
    S->>N: prisma.user.findUnique(userId)
    N-->>S: User Profile Data
    S-->>C: 200 OK (JSON Data)
```

### 2.3 API Definition & Configuration Flow

API definitions and configs are stored in **MongoDB 1** (specifically `APIConfig_db`). 

```mermaid
sequenceDiagram
    box rgba(52, 152, 219, 0.15) Frontend
    participant C as Client
    end
    
    box rgba(46, 204, 113, 0.15) Backend (Express)
    participant WL as WriteLock / Auth
    participant S as API Controller
    end
    
    box rgba(241, 196, 15, 0.15) Databases
    participant M1 as MongoDB 1 (APIConfig_db)
    end

    %% Fetch APIs
    C->>S: GET /api (optionalAuth)
    S->>M1: Find APIs for user
    M1-->>S: APIs List
    S-->>C: 200 OK (data array)

    %% Register API
    C->>WL: POST /api
    WL->>WL: Verify Write Lock Permissions
    WL->>S: Allowed
    S->>M1: Save to API Collection
    M1-->>S: Saved
    S-->>C: 201 Created

    %% Get Config
    C->>S: GET /config/api/:id
    S->>M1: Find in API_Config Collection
    M1-->>S: Config Document
    S-->>C: 200 OK (Config Data)
    
    %% Delete API
    C->>WL: DELETE /api/:id
    WL->>S: Allowed
    S->>M1: Delete API Document
    M1-->>S: Success
    S-->>C: 200 OK
```

### 2.4 Runtime & Products Flow (Read-Only)

Production product data is read-only and is fetched from **MongoDB 2** (`products` database). Includes multiple middlewares like `API_Token_Verify` and `runtimeCounter`.

```mermaid
sequenceDiagram
    box rgba(52, 152, 219, 0.15) Frontend
    participant C as Client
    end
    
    box rgba(46, 204, 113, 0.15) Backend (Express)
    participant M as Middlewares
    participant S as Product Controller
    end
    
    box rgba(241, 196, 15, 0.15) Databases
    participant M2 as MongoDB 2 (products)
    end

    C->>M: GET /runtime/products
    M->>M: Verify API Key, Counter, Limit (max 5/min)
    M->>S: Request Allowed
    S->>M2: Query PRODUCTS Collection
    M2-->>S: Array of Products
    S-->>C: 200 OK (Product List)
    
    C->>M: GET /runtime/products/:id (or /random)
    M->>S: Request Allowed
    S->>M2: Query Specific/Random Product(s)
    M2-->>S: Product Document(s)
    S-->>C: 200 OK
```

### 2.5 Sandbox Products Flow (CRUD)

Sandbox products allow creation, deletion, and updates, and are fetched from **MongoDB 2** (`sandboxProducts` database).

```mermaid
sequenceDiagram
    box rgba(52, 152, 219, 0.15) Frontend
    participant C as Client
    end
    
    box rgba(46, 204, 113, 0.15) Backend (Express)
    participant M as Middlewares
    participant V as Validation
    participant S as Sandbox Controller
    end
    
    box rgba(241, 196, 15, 0.15) Databases
    participant M2 as MongoDB 2 (sandboxProducts)
    end

    %% GET Sandbox Product
    C->>M: GET /runtime/products/sandbox/:username
    M->>S: Request Allowed
    S->>M2: Find by username
    M2-->>S: Product Data
    S-->>C: 200 OK
    
    %% POST Sandbox Product
    C->>M: POST /runtime/products/sandbox/
    M->>V: validateProductCreate
    V->>S: Validation Passed
    S->>M2: Insert Sandbox Document
    M2-->>S: Created
    S-->>C: 201 Created
    
    %% PATCH Sandbox Product
    C->>M: PATCH /runtime/products/sandbox/:id
    M->>V: validateProductPatch
    V->>S: Validation Passed
    S->>M2: Update Sandbox Document
    M2-->>S: Updated
    S-->>C: 200 OK
    
    %% DELETE Sandbox Product
    C->>M: DELETE /runtime/products/sandbox/:id
    M->>S: Allowed
    S->>M2: Delete Sandbox Document
    M2-->>S: Deleted
    S-->>C: 200 OK
```

### 2.6 Real-time WebSocket Flow (Socket.IO & WebRTC Signaling)

Socket connections are authenticated using the `access_token` cookie. Once authenticated, they communicate entirely in memory unless a specific event writes to a database. Since the frontend is using WebRTC, this socket connection acts as the signaling server.

```mermaid
sequenceDiagram
    box rgba(52, 152, 219, 0.15) Frontend
    participant C as Client (WebRTC/Socket)
    end
    
    box rgba(46, 204, 113, 0.15) Backend (Node.js)
    participant IO as Socket.IO Server
    participant Auth as Socket Auth Middleware
    end

    C->>IO: Connection Request (ws://)
    IO->>Auth: Pass handshake cookies
    Auth->>Auth: Verify access_token JWT
    alt Token Invalid
        Auth-->>C: Connection Rejected
    else Token Valid
        Auth-->>IO: Connection Allowed (Attach User)
        IO-->>C: Emit "members" (Connected Count)
        
        %% Signaling Example
        C->>IO: Emit "message" (WebRTC Offer/Answer/ICE)
        IO-->>C: Broadcast "message" to other peers
    end
```
