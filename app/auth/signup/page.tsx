"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-[var(--font-inter)] px-6">
      <div className="max-w-md w-full bg-background-tertiary/70 backdrop-blur-md rounded-2xl border border-accent/40 shadow-lg p-8 space-y-6">
        {/* Logo / Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-accent">MugiwaraFrostTV</h1>
          <p className="text-foreground-muted mt-2">Join the Crew</p>
          <p className="text-sm text-foreground-muted">
            Create your account and start streaming anime
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-foreground-secondary mb-1">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className="w-full bg-background-secondary text-foreground px-3 py-2 rounded-md border border-border focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground-secondary mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-background-secondary text-foreground px-3 py-2 rounded-md border border-border focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground-secondary mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full bg-background-secondary text-foreground px-3 py-2 rounded-md border border-border focus:border-green focus:outline-none transition-colors"
            />
            <p className="text-xs text-foreground-muted mt-1">
              Must be at least 8 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm text-foreground-secondary mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full bg-background-secondary text-foreground px-3 py-2 rounded-md border border-border focus:border-green focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 mt-3">
            <input type="checkbox" id="terms" className="accent-accent" />
            <label htmlFor="terms" className="text-sm text-foreground-secondary">
              I agree to the{' '}
              <a href="#" className="text-accent hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-accent hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-green hover:bg-green-hover text-black font-semibold py-2 rounded-md transition-colors"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-grow h-px bg-border"></div>
          <span className="text-foreground-muted text-sm">or sign up with</span>
          <div className="flex-grow h-px bg-border"></div>
        </div>

        {/* Social buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="w-full bg-background-secondary hover:bg-background hover:text-green py-2 rounded-md border border-border flex justify-center items-center gap-2 transition-colors">
            <span className="text-sm font-medium">Google</span>
          </button>
          <button className="w-full bg-background-secondary hover:bg-background hover:text-green py-2 rounded-md border border-border flex justify-center items-center gap-2 transition-colors">
            <span className="text-sm font-medium">Discord</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-foreground-secondary mt-6">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-accent hover:underline">
            Sign in
          </Link>
        </div>

        {/* Optional Free-Watch Notice */}
        <div className="text-center mt-4 p-4 bg-background-secondary/50 rounded-lg border border-green/20">
          <p className="text-xs text-foreground-muted mb-2">
            No account creation needed — it&apos;s free to watch!
          </p>
          <Link
            href="/browse"
            className="text-green hover:underline text-sm font-semibold"
          >
            Continue as Guest →
          </Link>
        </div>
      </div>
    </main>
  );
}
