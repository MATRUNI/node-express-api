import crypto from "crypto";


export default function hmac(data,action)
{
    const body = {
        action,
        config:data
    };
    const timeStamp = Date.now();

    const payload = timeStamp + "." + JSON.stringify(body);

    const signature = crypto.createHmac(
        'sha256', 
        process.env.SECRET_CRYPTO_KEY
    ).update(payload)
    .digest('base64');

    return {
        timeStamp,
        signature
    }
}

