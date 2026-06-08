
export async function requestOTP({ email, otp }) {
    try {
        const res = await fetch(process.env.SOMETHING_PATH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "server-key": process.env.SERVER_KEY,
                "server-address": process.env.SERVER_ADDRESS
            },
            body: JSON.stringify({ email, otp })
        });

        const payload = await res.json();
        return payload;
    } catch (error) {
        console.error("Mailer Error Log:", error);
        return {
            success: false,
            error: error.message
        };
    }
}