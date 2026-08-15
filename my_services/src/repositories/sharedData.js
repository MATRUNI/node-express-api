import prisma from "../lib/prisma.js";

export async function createSharedData(encryptedData,sender,recievers) 
{
    try 
    {
        return await prisma.sharedData.create({
          data: {
            ownerId: sender,
            data: encryptedData,
            expiresAt:new Date(Date.now() + 60 * 60 * 1000),
            recipients:{
              create:recievers.map(userId=>({userId}))
            }
          },
          include:{
            recipients:true
          }
        });  
    } 
    catch (error) 
    {
        console.error("Failed to save shared data:", error);
        throw new Error("Database error");
    }
}

export async function getPendingSharedDataCount(userId) {
    return await prisma.sharedDataRecipient.count({
        where: {
                userId,
                sharedData: {
                    expiresAt: {
                    gt: new Date()
                }
            }
        }
    });
}

export async function getSharedData(userId,sharedDataId) 
{
    return await prisma.sharedDataRecipient.findFirst({
        where:{
            sharedDataId,
            userId,
            sharedData:{
                expiresAt:{
                    gt:new Date()
                }
            }
        },
        include:{
            sharedData:true
        }
    })    
}

export async function consumeSharedData(userId, sharedDataId) {
    return await prisma.$transaction(async (tx) => {
        let result;
        try {
            result = await tx.sharedDataRecipient.delete({
                where: {
                    sharedDataId_userId: {
                        sharedDataId,
                        userId
                    }
                }
            });
        } catch (error) {
            throw new Error("Shared data not found or already consumed");
        }

        const remaining = await tx.sharedDataRecipient.count({
            where: {
                sharedDataId
            }
        });

        if (remaining === 0) {
            await tx.sharedData.delete({
                where: {
                    id: sharedDataId
                }
            });
        }

        return {
            consumed: true,
            deleted: remaining === 0
        };
    });
}
