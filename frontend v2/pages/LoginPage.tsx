import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContextNew";
import { useToast } from "../contexts/ToastContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/ui/input-otp";

const countries = [
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "USA", code: "+1", flag: "🇺🇸" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "UK", code: "+44", flag: "🇬🇧" },
];

const LoginPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { addToast } = useToast();
  const { loginSendOtp, loginVerifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleVerifyOtp = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isLoading || otp.length !== 6) return;

      setIsLoading(true);
      const fullPhone = `${selectedCountry.code}${mobile}`;
      const response = await loginVerifyOtp(fullPhone, otp);

      if (response.success) {
        addToast("Login successful!", "success");
        navigate("/");
      } else {
        addToast(response.message, "error");
        setOtp("");
        setIsLoading(false);
        1;
      }
    },
    [
      isLoading,
      otp,
      mobile,
      loginVerifyOtp,
      addToast,
      navigate,
      selectedCountry,
    ],
  );

  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [step, countdown]);

  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp();
    }
  }, [otp, handleVerifyOtp]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!mobile.trim()) {
      addToast("Please enter a mobile number.", "warning");
      return;
    }

    setIsLoading(true);
    const fullPhone = `${selectedCountry.code}${mobile}`;
    const response = await loginSendOtp(fullPhone);
    setIsLoading(false);

    if (response.success) {
      addToast(response.message, "success");
      setStep(2);
      setCountdown(15);
    } else {
      addToast(response.message, "error");
    }
  };

  const buttonStyles =
    "w-full flex justify-center px-8 py-3 bg-indigo-800 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-900 transition-colors disabled:opacity-50";

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-teal-100 via-blue-100 to-orange-100 overflow-hidden">
      {/* Abstract shapes */}
      <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[5%] w-96 h-96 bg-teal-200 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[10%] left-[20%] w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-6xl mx-auto flex justify-start z-10">
        <div className="w-full max-w-xl p-8 md:p-12 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl min-h-[550px] flex flex-col justify-center">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight">
              {step === 1 ? "Welcome Back" : "Enter OTP Sent"}
            </h1>
            <p className="mt-4 text-slate-700 max-w-prose mx-auto">
              {step === 1
                ? "Sign in to your account"
                : `An OTP has been sent to ${selectedCountry.code} ${mobile}. (Hint: 123456)`}
            </p>
          </div>

          <div className="mt-12">
            {step === 1 && (
              <form className="space-y-6" onSubmit={handleSendOtp}>
                <div>
                  <label htmlFor="mobile" className="sr-only">
                    Mobile Number
                  </label>
                  <div className="flex items-center w-full bg-slate-100/50 border border-slate-300/30 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent">
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        className="flex items-center space-x-2 pl-4 pr-3 py-3"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}>
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="font-semibold text-slate-800 text-sm">
                          {selectedCountry.code}
                        </span>
                        <svg
                          className="w-4 h-4 text-slate-600"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"></path>
                        </svg>
                      </button>
                      {isDropdownOpen && (
                        <ul
                          className="absolute z-10 mt-1 w-48 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                          role="listbox">
                          {countries.map((country) => (
                            <li
                              key={country.name}
                              className="px-4 py-2 text-left cursor-pointer hover:bg-slate-100 flex items-center"
                              onClick={() => {
                                setSelectedCountry(country);
                                setIsDropdownOpen(false);
                              }}
                              role="option"
                              aria-selected={
                                selectedCountry.name === country.name
                              }>
                              <span className="mr-3 text-lg">
                                {country.flag}
                              </span>
                              <span className="text-sm text-slate-800">
                                {country.name} ({country.code})
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="w-px h-6 bg-slate-400/50"></div>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="123-456-7890"
                      className="w-full bg-transparent outline-none placeholder-slate-500 pl-4 pr-4 py-3 text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className={buttonStyles}
                    disabled={isLoading}>
                    {isLoading ? "Sending..." : "Sign In"}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form className="space-y-6" onSubmit={handleVerifyOtp}>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {countdown > 0 ? (
                  <p className="text-center text-sm text-slate-700">
                    Resend OTP in {countdown}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-sm text-center w-full text-indigo-600 hover:underline">
                    Resend OTP
                  </button>
                )}
                <div>
                  <button
                    type="submit"
                    className={buttonStyles}
                    disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Submit"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-700">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-indigo-600 hover:text-indigo-800">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
