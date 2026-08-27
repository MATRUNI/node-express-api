# API-OS Backend Microservice

The robust backend engine powering the **API-OS / API Workbench** platform. Designed for high performance, real-time collaboration, and secure API execution, this service acts as the central nervous system connecting operators to their customized environments.

> 🔗 **Frontend Repository**: [MATRUNI/api-workbench-frontend](https://github.com/MATRUNI/api-workbench-frontend)  
> 🌐 **Live Application**: [https://api-os.pages.dev](https://api-os.pages.dev)

## 🚀 Key Features

*   **Real-Time Architecture**: Powered by `Socket.IO` to handle real-time configuration sharing, terminal-styled chat (`SHELL_STREAM`), and WebRTC signaling for peer-to-peer operator voice calls.
*   **Dual Database System**: 
    *   **Neon (PostgreSQL)** via Prisma: Manages robust relational data including User Profiles, Authentication, and Sessions.
    *   **MongoDB (Mongoose)**: Highly scalable document storage for dynamic API configurations, sandbox environments, and OTP verification logs.
*   **Secure Authentication Workflow**: Token-based authentication using HttpOnly JWT cookies (Access & Refresh tokens). Includes a mandatory Email OTP verification step for new operator registration.
*   **Rate Limiting & Security**: Built-in IP rate limiting, bot-blocking middlewares, and API Key verification (`FRONTEND_API_KEY`) to ensure endpoint security and protect against unauthorized access.
*   **Sandbox & Production Runtimes**: Isolated `/runtime` routes to query mock production data, along with a user-specific sandbox environment allowing full CRUD operations for testing.

## 🛠️ Tech Stack

*   **Runtime**: Node.js (v20.x)
*   **Framework**: Express.js 5
*   **Real-Time**: Socket.IO (v4)
*   **Databases**: PostgreSQL (Neon Tech) & MongoDB Atlas
*   **ORM / ODM**: Prisma Client & Mongoose
*   **Security & Validation**: JWT, bcryptjs, Helmet, Zod, express-rate-limit

## 📂 Project Structure

```text
my_services/
├── src/
│   ├── cache/          # In-memory caching for products
│   ├── config/         # Database connection logic
│   ├── controller/     # Business logic for routes
│   ├── lib/            # Prisma client instance
│   ├── middlewares/    # Auth, Rate Limits, API Keys, Bot Blocking, Error Handling
│   ├── models/         # Mongoose Schemas (API configs, OTPs, Products)
│   ├── repositories/   # Data access layer
│   ├── routes/         # Express Route definitions
│   ├── services/       # Core services
│   ├── socket/         # Socket.io initialization, auth, and event handlers
│   ├── utils/          # Helper functions and utilities
│   ├── app.js          # Express app configuration & middleware pipeline
│   └── server.js       # Entry point, HTTP & Socket.IO server initialization
├── prisma/             # Prisma schema and migrations
├── .env                # Environment variables
└── package.json        # Dependencies and scripts
```

## 📖 Deep-Dive Documentation

For detailed internal mechanisms, refer to these dedicated markdown files:
*   [**API_DOCUMENTATION.md**](./API_DOCUMENTATION.md): Complete breakdown of all REST endpoints, Token structures (JWTs), and expected request/response JSON formats.
*   [**REQUEST_FLOWS.md**](./REQUEST_FLOWS.md): Mermaid.js diagrams illustrating the end-to-end request lifecycle across the frontend, Node.js server, and multiple databases.

## ⚙️ Getting Started

### Prerequisites

Ensure you have Node.js (v20+) installed and access to both PostgreSQL and MongoDB instances.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd BackEnd_Micro_Service/my_services
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the `my_services` root directory matching the following structure:
    ```env
    # Database Connections
    NEON_DB="postgresql://user:pass@host/db?sslmode=require"
    MONGO_URI="mongodb+srv://..."
    MONGO_URI_PRODUCT="mongodb+srv://..."
    AUDIO_DB="mongodb+srv://..."

    # JWT Secrets
    SECRET_KEY="your_jwt_access_secret"
    REFRESH_SECRET_KEY="your_jwt_refresh_secret"

    # API Security
    FRONTEND_API_KEY="your_frontend_api_key"
    FRONTEND_URLS="http://localhost:5173"
    
    # Environment
    NODE_ENV="local"
    PORT=5000
    ```

4.  **Database Synchronization**:
    Generate the Prisma client:
    ```bash
    npx prisma generate
    ```

5.  **Start the Server**:
    ```bash
    # Development mode (with nodemon)
    npm run dev
    
    # Production mode
    npm start
    ```
    The server will start at `http://localhost:5000` (or your defined `PORT`).

---
*Developed for the API-OS Platform.*