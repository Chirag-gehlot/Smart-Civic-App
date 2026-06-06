import React from "react";
import { MessageSquare, Shield, Lock } from "lucide-react";

/**
 * LOADING SCREEN COMPONENT
 * Beautiful loading screen that matches CivicTrust's indigo/teal color scheme
 * Can be used anywhere in the app where loading state is needed
 */

// ============================================================
// VARIANT 1: Simple Spinner with Logo
// Clean and minimal, good for quick loads
// ============================================================
export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative mx-auto w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Message */}
        <p className="text-indigo-900 font-semibold text-lg">{message}</p>
        <p className="text-gray-500 text-sm mt-1">Please wait...</p>
      </div>
    </div>
  );
};

// ============================================================
// VARIANT 2: Animated Logo with Pulse
// More branded, shows CivicTrust identity
// ============================================================
export const LoadingLogo: React.FC<{ message?: string }> = ({
  message = "Loading CivicTrust...",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700">
      <div className="text-center">
        {/* Animated Logo Container */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          {/* Pulsing background circles */}
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>

          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-2xl">
            <Lock className="text-indigo-600" size={40} />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-white font-bold text-2xl mb-2">CivicTrust</h2>
        <p className="text-indigo-200 text-sm">{message}</p>

        {/* Loading bar */}
        <div className="mt-6 w-48 mx-auto h-1 bg-indigo-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-400 rounded-full animate-pulse"
            style={{ width: "60%" }}></div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VARIANT 3: Three Dots Bouncing
// Playful and dynamic, good for chat loading
// ============================================================
export const LoadingDots: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-indigo-100 rounded-full">
            <MessageSquare className="text-indigo-600" size={32} />
          </div>
        </div>

        {/* Bouncing dots */}
        <div className="flex justify-center space-x-2 mb-4">
          <div
            className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}></div>
          <div
            className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}></div>
          <div
            className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}></div>
        </div>

        {/* Message */}
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

// ============================================================
// VARIANT 4: Skeleton Loading (for content)
// Shows layout preview while loading
// ============================================================
export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar skeleton */}
      <div className="w-72 bg-indigo-900 p-4">
        <div className="h-10 bg-indigo-800 rounded-lg mb-4 animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 bg-indigo-800 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}></div>
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-start space-x-3 animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}>
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VARIANT 5: Full Page with Progress
// Most informative, shows loading progress
// ============================================================
export const LoadingProgress: React.FC<{
  message?: string;
  progress?: number; // 0-100
}> = ({ message = "Initializing CivicTrust...", progress = 0 }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Rotating ring */}
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="text-indigo-600" size={32} />
            </div>
          </div>
        </div>

        {/* Message */}
        <h3 className="text-center text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h3>
        <p className="text-center text-sm text-gray-500 mb-6">
          Setting up your secure environment
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}></div>
        </div>

        {/* Progress percentage */}
        <p className="text-center text-xs text-gray-500 mt-2">
          {progress}% complete
        </p>
      </div>
    </div>
  );
};

// ============================================================
// VARIANT 6: Card Loading (for smaller areas)
// Compact loading for specific sections
// ============================================================
export const LoadingCard: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex items-center justify-center p-8 bg-white rounded-xl border border-gray-200">
      <div className="text-center">
        {/* Small spinner */}
        <div className="relative mx-auto w-10 h-10 mb-3">
          <div className="absolute inset-0 border-3 border-indigo-200 rounded-full"></div>
          <div className="absolute inset-0 border-3 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// ============================================================
// RECOMMENDED: Full App Loading Component
// This is the recommended one to use for app initialization
// ============================================================
const LoadingScreen: React.FC<{ message?: string }> = ({
  message = "Loading CivicTrust...",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700">
      <div className="text-center px-4">
        {/* Animated logo with rotating ring */}
        <div className="relative mx-auto w-28 h-28 mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-white/40 rounded-full border-t-transparent animate-spin"></div>

          {/* Pulsing background */}
          <div className="absolute inset-2 bg-white/10 rounded-full animate-pulse"></div>

          {/* Center logo */}
          <div className="absolute inset-4 flex items-center justify-center bg-white rounded-full shadow-2xl">
            <Shield className="text-indigo-600" size={40} />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-white font-bold text-3xl mb-2">CivicTrust</h1>

        {/* Message */}
        <p className="text-indigo-200 text-base mb-6">{message}</p>

        {/* Animated loading bar */}
        <div className="w-56 mx-auto h-1 bg-indigo-900/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-400 to-white animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
