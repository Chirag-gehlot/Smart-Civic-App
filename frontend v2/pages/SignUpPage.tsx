import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContextNew";

const countries = [
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "USA", code: "+1", flag: "🇺🇸" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "UK", code: "+44", flag: "🇬🇧" },
];

const SignUpPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { sendOtp, verifyOtp } = useAuth();

  // Auto-submit OTP when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp();
    }
  }, [otp]);

  // Close country dropdown when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      addToast("Please enter both name and mobile number.", "warning");
      return;
    }

    setIsLoading(true);

    // Combine country code with mobile number
    const fullPhoneNumber = selectedCountry.code + mobile;

    const response = await sendOtp(fullPhoneNumber, name);

    setIsLoading(false);

    if (response.success) {
      addToast(response.message, "success");
      setStep(2); // move to OTP step
    } else {
      // Show detailed error if available
      const msg = response.message || response.error || "Failed to send OTP";
      addToast(msg, "error");
      console.error("sendOtp response:", response);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otp.length !== 6 || isLoading) return;

    setIsLoading(true);
    const fullPhoneNumber = selectedCountry.code + mobile;
    const response = await verifyOtp(fullPhoneNumber, otp);
    setIsLoading(false);

    if (response.success) {
      addToast("Sign up successful! Welcome!", "success");
      navigate("/"); // redirect after successful signup
    } else {
      addToast(response.message, "error");
      setOtp(""); // clear OTP input
    }
  };

  const inputStyles =
    "w-full px-4 py-3 bg-slate-100/50 border border-slate-300/30 rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-800";
  const buttonStyles =
    "w-full flex justify-center px-8 py-3 bg-indigo-800 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-900 transition-colors disabled:opacity-50";

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-teal-100 via-blue-100 to-orange-100 overflow-hidden">
      {/* Abstract shapes */}
      <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[5%] w-96 h-96 bg-teal-200 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[10%] left-[20%] w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-6xl mx-auto flex justify-start z-10">
        <div className="w-full max-w-xl p-8 md:p-12 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl min-h-[650px] flex flex-col justify-center">
          {step === 1 ? (
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                Make your Civic Sense better
              </h1>
              <p className="mt-4 text-slate-700 max-w-prose mx-auto">
                Stay informed and connected with the latest civic initiatives,
                community projects, and smart solutions shaping our cities.
                Subscribe to get updates directly from Smart Civic and be part
                of positive change.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight whitespace-pre-line">
                {`Welcome\n${name}`}
              </h1>
            </div>
          )}

          <div className="mt-12">
            {step === 1 && (
              <form className="space-y-6" onSubmit={handleSendOtp}>
                <div>
                  <label htmlFor="full-name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={inputStyles}
                  />
                </div>
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
                    {isLoading ? "Sending..." : "Sign up"}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form className="space-y-6" onSubmit={handleVerifyOtp}>
                <p className="text-sm text-center text-slate-700 mb-4">
                  An OTP has been sent to {selectedCountry.code} {mobile}.
                  Please enter it below. (Hint: 123456)
                </p>
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
                <div>
                  <button
                    type="submit"
                    className={buttonStyles}
                    disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Submit"}
                  </button>
                </div>

                {/* Change mobile number button */}
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                  }}
                  className="text-sm text-center w-full text-indigo-600 hover:underline">
                  Change mobile number
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-700">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-800">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
