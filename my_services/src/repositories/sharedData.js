import prisma from "../lib/prisma.js";

// creating the data in tables
export async function createSharedData(encryptedData,sender,recievers, message) 
{
    try 
    {
        return await prisma.sharedData.create({
          data: {
            ownerId: sender,
            data: encryptedData,
            message,
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

// for data creator, to know how recipients are remaining to cosume the data
export async function getSharedDataRecipientNames(sharedDataId) {
  const sharedData = await prisma.sharedData.findUnique({
    where: {
      id: sharedDataId
    },
    select: {
      recipients: {
        select: {
          user: {
            select: {
              username: true
            }
          }
        }
      }
    }
  });

  if (!sharedData) {
    throw new Error("Shared data not found");
  }

  return sharedData.recipients.map(
    recipient => recipient.user.username
  );
}

// for recipients to get the usename of data creator
export async function getSharedDataOwner(sharedDataId,recipientUserId) 
{
  const sharedData = await prisma.sharedData.findFirst({
    where: {
      id: sharedDataId,
      recipients: {
        some: {
          userId: recipientUserId
        }
      }
    },
    select: {
      owner: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });

  if (!sharedData) {
    throw new Error("Shared data not found or access denied");
  }

  return sharedData.owner;
}

// get actual shared data
export async function getSharedData(userId,sharedDataId) 
{
    return await prisma.sharedDataRecipient.findUnique({
        where:{
            sharedDataId_userId:{
                sharedDataId,
                userId,
            },
        },
        select:{
            sharedData:{
                select:{
                    data:true
                }
            }
        }
    })    
}

// consume/ delete the user from recipient list and none left delete the shared data too
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

export async function gotAnySharedData(userId) 
{
    return await prisma.sharedDataRecipient.findMany({
      where:{
        userId
      },
      include:{
        sharedData:{
          select:{
            owner:{
              select:{
                username:true,
                id:true
              }
            },
            message:true
          }
        }
      }
    })
}