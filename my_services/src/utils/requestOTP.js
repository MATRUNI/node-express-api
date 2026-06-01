
export async function requestOTP({email,otp}) 
{
    const emailData = {
      sender_name: "API.OS SECURITY",
      sender_email: process.env.SMTP_USER,
      sender_password: process.env.SMTP_PASS,
      recipient_email: email,
      subject: "■ API.OS // SECURITY CHALLENGE TOKEN",
      text: "",
      html: `
        <div style="background: #000000; color: #ffffff; padding: 30px; font-family: monospace; border: 1px solid #27272a; border-radius: 8px; max-width: 450px; margin: auto;">
          <h1 style="margin: 0; font-size: 2rem; letter-spacing: -1px; font-weight: 900;">API<span style="color: #a855f7;">.OS</span></h1>
          <p style="color: #8b949e; font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 25px;">IDENTITY_VERIFICATION_MODULE</p>
          <div style="border: 1px dashed #27272a; padding: 20px; text-align: center; background: #141414; border-radius: 6px;">
            <span style="color: #8b949e; font-size: 0.7rem; display: block; margin-bottom: 10px; letter-spacing: 2px;">YOUR_ACCESS_TOKEN</span>
            <span style="font-size: 2.2rem; font-weight: bold; color: #49cc90; letter-spacing: 6px;">${otp}</span>
          </div>
          <p style="color: #8b949e; font-size: 0.7rem; margin-top: 25px; line-height: 1.4;">
            This security hash token expires in 05:00 minutes.<br />
            If you did not request authentication mapping, ignore this automated protocol transmission securely.
          </p>
        </div>
      `
    };
    try 
    {
        const res = await fetch(process.env.MAIL_API_SERVICE,{
            method:"POST",
            headers:{
                'Context-Type':'application/json',
                'api-key':process.env.MAIL_API_SECRET_KEY
            },
            body:JSON.stringify(emailData)
        });
        const payload = await res.json()
        return payload
    } 
    catch (error) 
    {
        console.error("Mailer Error Log:", error);
        return {
            success: false,
            error: error.message
        };
    }
}