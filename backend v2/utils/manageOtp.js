export async function sendOtp(client, phoneNumber) {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    console.log("Twilio verification response:", verification); // ✅ log
    return { success: true, verification };
  } catch (error) {
    console.error("Twilio sendOtp error:", error); // ✅ log full error
    return { success: false, error: error.message || error.toString() };
  }
}

export async function verifyOtp(client, phoneNumber, code) {
  try {
    console.log(`Verifying OTP for: ${phoneNumber} ${code}`);
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });

    console.log("Twilio verificationCheck response:", verificationCheck);

    if (verificationCheck.status === "approved") {
      return { success: true, message: "Phone verified!" };
    } else {
      return { success: false, message: "Invalid OTP" };
    }
  } catch (error) {
    console.error("Twilio verifyOtp error:", error);
    return { success: false, message: error.message };
  }
}
