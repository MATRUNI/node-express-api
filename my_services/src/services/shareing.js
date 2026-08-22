import hmac from "../utils/hmac.js";
import AppErrors from "../utils/AppErrors.js";
import { createSharedData, 
        getPendingSharedDataCount, 
        consumeSharedData, 
        getSharedData} from "../repositories/sharedData.js";
import { sendNotification } from "../socket/notificationHandler.js";
import { getCachedUsername } from '../cache/usernameCache.js'
import { findUsernamePrefix } from "../utils/fincUsernamePrefix.js";

export async function putSharedData({data,sender,recievers}) 
{
    try 
    {
        const configData = data
        
        const {timeStamp: encryptTimestamp,signature: encryptSignature} = hmac(configData, "encrypt");

        const encryptResponse = await fetch(
            process.env.COMPRESS_SERVER,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-server-address": process.env.SERVER_ADDRESS,
                    "x-server-key": process.env.SERVER_KEY,
                    "x-timestamp": String(encryptTimestamp),
                    "x-signature": encryptSignature
                },
                body: JSON.stringify({action:"encrypt",config:configData})
            }
        );

        if (!encryptResponse.ok) {
          throw new Error(
            `Encryption server returned ${encryptResponse.status}`
          );
        }

        const encryptResult = await encryptResponse.json();

        if (!encryptResult.success || !encryptResult.encrypted) {
            throw new Error(
                `Encryption failed: ${JSON.stringify(encryptResult)}`
            );
        }
        const encryptedData = encryptResult.encrypted;

        const sharedData = await createSharedData(encryptedData, sender, recievers)

        sendNotification({
            receiverIds: recievers, 
            event: "share:received", 
            payload: { from: sender, id: sharedData.id }
        }).catch(err => console.error("Notification error:", err));
        return {success:true,message:"Config shared!"}
    } 
    catch (error) 
    {
        console.error("putSharedData failed:", error);
        return {success:false,message:"Internal Server Error."}    
    }
}


export async function getSharedDataUser(userId) 
{
    return await getPendingSharedDataCount(userId)
}

export async function consumeData({userId,sharedDataId}) 
{
    const sharedData = await getSharedData(userId, sharedDataId);

    if (!sharedData) {
        throw new AppErrors("Shared data not found", 404);
    }

    const encryptedData = sharedData.sharedData;

    if (!encryptedData) {
        throw new AppErrors("Shared data no longer exists", 410);
    }
    const {timeStamp: decryptTimestamp,signature: decryptSignature} = hmac(encryptedData.data, "decrypt");

    const decryptRequestBody = {
        action: "decrypt",
        config: encryptedData.data
    };

    const decryptResponse = await fetch(
        process.env.COMPRESS_SERVER,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-server-address": process.env.SERVER_ADDRESS,
                "x-server-key": process.env.SERVER_KEY,
                "x-timestamp": String(decryptTimestamp),
                "x-signature": decryptSignature
            },
            body: JSON.stringify(decryptRequestBody)
        }
    );
    if (!decryptResponse.ok) {
      throw new AppErrors(
        `Decryption server returned ${decryptResponse.status}`, 502
      );
    }
    const decryptResult = await decryptResponse.json();
    if (!decryptResult.success || !decryptResult.decrypted) {
        throw new AppErrors(
            `Decryption failed: ${JSON.stringify(decryptResult)}`, 502
        );
    }
    
    await consumeSharedData(userId,sharedDataId)

    return decryptResult
}

export async function getUsernamesWithPrefix({pre}) 
{
    return findUsernamePrefix(await getCachedUsername(),pre)
}