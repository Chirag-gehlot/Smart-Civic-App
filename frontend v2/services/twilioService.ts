
export const twilioService = {
  sendOtp: (mobile: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending OTP to ${mobile}`);
        resolve({ success: true, message: "OTP sent successfully." });
      }, 1000);
    });
  },

  verifyOtp: (mobile: string, code: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Verifying OTP ${code} for ${mobile}`);
        if (code === '123456') {
          resolve({ success: true, message: "OTP verified successfully." });
        } else {
          resolve({ success: false, message: "Invalid OTP." });
        }
      }, 1500);
    });
  },
};
