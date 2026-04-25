import { Resend } from "resend";

const resend = new Resend(
 process.env.RESEND_API_KEY
);

export async function sendOTP(
 email:string,
 otp:string
){

 const result = await resend.emails.send({
   from:"onboarding@resend.dev",
   to:email,
   subject:"Your OTP Code",
   html:`
   <h2>Verification Code</h2>
   <h1>${otp}</h1>
   `
 });

 console.log(result);
}