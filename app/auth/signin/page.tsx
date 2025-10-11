"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            MugiwaraFrostTV
          </h1>
          <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-foreground-secondary">
            Sign in to continue your anime journey
          </p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted hover:text-foreground"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-accent bg-background border-border rounded focus:ring-accent focus:ring-2"
                />
                <span className="ml-2 text-sm text-foreground-secondary">
                  Remember me
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background-secondary text-foreground-muted">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-3 px-4 border border-border rounded-lg bg-background hover:bg-background-tertiary transition-colors">
                <span className="text-sm font-medium text-foreground">Google</span>
              </button>
              <button className="w-full inline-flex justify-center py-3 px-4 border border-border rounded-lg bg-background hover:bg-background-tertiary transition-colors">
                <span className="text-sm font-medium text-foreground">Discord</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-foreground-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-accent hover:text-accent-hover font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
