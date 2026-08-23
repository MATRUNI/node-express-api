import prisma from "../lib/prisma.js"

let cacheUsername = null;

export async function getCachedUsername(forcedRefresh = false) 
{
    if(!forcedRefresh && cacheUsername) return cacheUsername;

    cacheUsername = (await prisma.user.findMany({
        select:{
            id:true,
            username:true
        },
        orderBy:{
            username:"asc"
        }
    }))
    console.log("Cache Refreshed!")
    return cacheUsername;
}