"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

const COVER_IMAGES: Record<Mode, string> = {
  login: "/images/login_cover.png",
  signup: "/images/signup_cover.png",
};

type Mode = "login" | "signup";

const SWAP_EASE = [0.76, 0, 0.24, 1] as const;
const SWAP_DURATION = 0.7;
const CONTENT_DURATION = 0.35;

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setShowPassword(false);
  };

  const isLogin = mode === "login";

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-white/[0.015] rounded-full blur-[200px] pointer-events-none" />

      {/* ─── MOBILE / TABLET: form only ─── */}
      <div className="flex md:hidden flex-col w-full min-h-screen px-5 py-6 sm:px-6 sm:py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6 sm:mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: CONTENT_DURATION, ease: SWAP_EASE }}
            >
              {isLogin ? (
                <LoginForm
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  onToggle={toggleMode}
                />
              ) : (
                <SignupForm
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  onToggle={toggleMode}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─── DESKTOP: side-by-side with swap ─── */}
      <div className="hidden md:flex relative z-10 w-full h-screen">
        {/* Form Panel */}
        <motion.div
          layout
          transition={{ duration: SWAP_DURATION, ease: SWAP_EASE }}
          className="flex w-1/2 h-full items-center justify-center shrink-0"
          style={{ order: isLogin ? 0 : 1 }}
        >
          <div className="w-full max-w-sm lg:max-w-md xl:max-w-lg px-8 lg:px-12 xl:px-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8 lg:mb-12 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: CONTENT_DURATION, ease: SWAP_EASE }}
              >
                {isLogin ? (
                  <LoginForm
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    onToggle={toggleMode}
                  />
                ) : (
                  <SignupForm
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    onToggle={toggleMode}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Image Panel */}
        <motion.div
          layout
          transition={{ duration: SWAP_DURATION, ease: SWAP_EASE }}
          className="relative w-1/2 h-full shrink-0 flex items-center justify-center p-5 lg:p-8"
          style={{ order: isLogin ? 1 : 0 }}
        >
          <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden">
            <Image
              src={COVER_IMAGES[mode]}
              alt={isLogin ? "Login cover" : "Signup cover"}
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Login Form ─── */

function LoginForm({
  showPassword,
  setShowPassword,
  onToggle,
}: {
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  onToggle: () => void;
}) {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
        Welcome back
      </h1>
      <p className="text-zinc-500 text-sm mb-6 sm:mb-8 lg:mb-10">
        Sign in to your FrameMeta account
      </p>

      <form className="space-y-4 lg:space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="login-email" className="block text-sm font-medium text-zinc-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-zinc-600 outline-none focus:border-white/[0.2] focus:bg-white/[0.06] transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="login-password" className="block text-sm font-medium text-zinc-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full h-11 sm:h-12 pl-11 pr-12 rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-zinc-600 outline-none focus:border-white/[0.2] focus:bg-white/[0.06] transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full h-11 sm:h-12 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          Sign in
        </button>
      </form>

      <div className="flex items-center gap-4 my-5 sm:my-6">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-zinc-600">or</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <div className="space-y-3">
        <button className="w-full h-11 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-300 font-medium hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5">
          <GoogleIcon />
          Continue with Google
        </button>
        <button className="w-full h-11 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-300 font-medium hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5">
          <AppleIcon />
          Continue with Apple
        </button>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6 sm:mt-8">
        Don&apos;t have an account?{" "}
        <button onClick={onToggle} className="text-white font-medium hover:underline cursor-pointer">
          Sign up
        </button>
      </p>
    </>
  );
}

/* ─── Signup Form ─── */

function SignupForm({
  showPassword,
  setShowPassword,
  onToggle,
}: {
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  onToggle: () => void;
}) {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
        Create account
      </h1>
      <p className="text-zinc-500 text-sm mb-6 sm:mb-8 lg:mb-10">
        Start your cinematic journey with FrameMeta
      </p>

      <form className="space-y-4 lg:space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="signup-name" className="block text-sm font-medium text-zinc-300">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
            <input
              id="signup-name"
              type="text"
              placeholder="John Doe"
              className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-zinc-600 outline-none focus:border-white/[0.2] focus:bg-white/[0.06] transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="signup-email" className="block text-sm font-medium text-zinc-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-zinc-600 outline-none focus:border-white/[0.2] focus:bg-white/[0.06] transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="signup-password" className="block text-sm font-medium text-zinc-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="w-full h-11 sm:h-12 pl-11 pr-12 rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-zinc-600 outline-none focus:border-white/[0.2] focus:bg-white/[0.06] transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-zinc-600 mt-1">Must be at least 8 characters</p>
        </div>

        <button
          type="submit"
          className="w-full h-11 sm:h-12 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          Create account
        </button>
      </form>

      <div className="flex items-center gap-4 my-5 sm:my-6">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-zinc-600">or</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <div className="space-y-3">
        <button className="w-full h-11 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-300 font-medium hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5">
          <GoogleIcon />
          Continue with Google
        </button>
        <button className="w-full h-11 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-300 font-medium hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5">
          <AppleIcon />
          Continue with Apple
        </button>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6 sm:mt-8">
        Already have an account?{" "}
        <button onClick={onToggle} className="text-white font-medium hover:underline cursor-pointer">
          Sign in
        </button>
      </p>
    </>
  );
}
