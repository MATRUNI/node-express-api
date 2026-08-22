import prisma from "../lib/prisma.js"

let cacheUsername = null;

export async function getCachedUsername(forcedRefresh = false) 
{
    if(!forcedRefresh && cacheUsername) return cacheUsername;

    cacheUsername = (await prisma.user.findMany({
        select:{
            username:true
        }
    })).map(user=>user.username)
    .sort((a, b) => a.localeCompare(b));
    console.log("Cache Refreshed!")
    return cacheUsername;
}