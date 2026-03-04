"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Server,
  Loader2,
  Shield,
  Key,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [usernameFocused, setusernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Check for saved username
  useEffect(() => {
    const savedusername = localStorage.getItem("rememberedusername");
    if (savedusername) {
      setusername(savedusername);
      setRememberMe(true);
    }
  }, []);

  const validateusername = (username: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(username);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!validateusername(username)) {
      setError("Please enter a valid username address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes - remove in production
      if (username === "admin@cloudforge.com" && password === "password123") {
        // Save username if remember me is checked
        if (rememberMe) {
          localStorage.setItem("rememberedusername", username);
        } else {
          localStorage.removeItem("rememberedusername");
        }

        setSuccess("Login successful! Redirecting...");

        // Redirect after success
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        throw new Error("Invalid credentials");
      }

      // Uncomment for real API
      /*
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (rememberMe) {
        localStorage.setItem("rememberedusername", username);
      } else {
        localStorage.removeItem("rememberedusername");
      }

      setSuccess("Login successful! Redirecting...");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      */
    } catch (err: any) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 
                    flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 
                      rounded-full mix-blend-multiply filter blur-3xl opacity-20 
                      animate-pulse"
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 
                      rounded-full mix-blend-multiply filter blur-3xl opacity-20 
                      animate-pulse animation-delay-2000"
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply 
                      filter blur-3xl opacity-10 animate-pulse animation-delay-4000"
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
            animate={{
              x: [
                Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              ],
              y: [
                Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
                Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              ],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div
          className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl 
                      rounded-2xl shadow-2xl border border-white/20 
                      dark:border-gray-800/50 overflow-hidden"
        >
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" as const, stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl 
                       mx-auto mb-4 flex items-center justify-center"
            >
              <Server className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              CloudForge
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm"
            >
              Server Control Panel
            </motion.p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 
                           rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-500 text-sm font-medium">Error</p>
                    <p className="text-red-400 text-xs mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/20 
                           rounded-lg flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-500 text-sm font-medium">
                      Success
                    </p>
                    <p className="text-green-400 text-xs mt-1">{success}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <motion.form
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleLogin}
              className="space-y-6"
            >
              {/* username Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  username Address
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 
                                  w-5 h-5 transition-colors duration-200
                                  ${usernameFocused || username ? "text-purple-400" : "text-gray-500"}`}
                  />
                  <input
                    type="username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    onFocus={() => setusernameFocused(true)}
                    onBlur={() => setusernameFocused(false)}
                    required
                    placeholder="admin@cloudforge.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-white/10 
                             rounded-xl text-black placeholder-gray-600 bg-white
                             focus:outline-none focus:ring-2 focus:ring-purple-500 
                             focus:border-transparent transition-all duration-200"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 
                                  w-5 h-5 transition-colors duration-200
                                  ${passwordFocused || password ? "text-purple-400" : "text-gray-500"}`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className="w-full pl-10 pr-12 py-3 bg-white border border-white/10 
                             rounded-xl text-black placeholder-gray-600 bg-white
                             focus:outline-none focus:ring-2 focus:ring-purple-500 
                             focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2
                             text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => {
                        let strength = 0;
                        if (password.length >= 6) strength++;
                        if (/[A-Z]/.test(password)) strength++;
                        if (/[0-9]/.test(password)) strength++;
                        if (/[^A-Za-z0-9]/.test(password)) strength++;

                        const active = i < strength;

                        return (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300
                              ${
                                active
                                  ? i === 0
                                    ? "bg-red-500"
                                    : i === 1
                                      ? "bg-yellow-500"
                                      : i === 2
                                        ? "bg-blue-500"
                                        : "bg-green-500"
                                  : "bg-gray-700"
                              }`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password strength:{" "}
                      {password.length < 6
                        ? "Too short"
                        : password.length < 8
                          ? "Weak"
                          : /[A-Z]/.test(password) &&
                              /[0-9]/.test(password) &&
                              /[^A-Za-z0-9]/.test(password)
                            ? "Strong"
                            : "Medium"}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-white 
                             checked:bg-purple-600 focus:ring-purple-500 
                             focus:ring-offset-0 transition-colors"
                  />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 
                           transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                         text-white font-semibold rounded-xl
                         hover:from-purple-700 hover:to-pink-700
                         focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:ring-offset-2 focus:ring-offset-gray-900
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transform transition-all duration-200
                         flex items-center justify-center gap-2
                         relative overflow-hidden group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Sign In</span>
                  </>
                )}

                {/* Shimmer Effect */}
                <div
                  className="absolute inset-0 -translate-x-full 
                              group-hover:translate-x-full 
                              transition-transform duration-1000
                              bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </motion.button>

              {/* Security Note */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4"
              >
                <Shield className="w-4 h-4" />
                <span>Secured with 256-bit encryption</span>
              </motion.div>
            </motion.form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-xs text-gray-500">
                Â© {new Date().getFullYear()} CloudForge. All rights reserved.
              </p>
              <div className="flex justify-center gap-4 mt-2">
                <Link
                  href="/privacy"
                  className="text-xs text-gray-600 hover:text-gray-400"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="text-xs text-gray-600 hover:text-gray-400"
                >
                  Terms
                </Link>
                <Link
                  href="/contact"
                  className="text-xs text-gray-600 hover:text-gray-400"
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-4 p-4 bg-white backdrop-blur rounded-lg border border-white/10"
        >
          <p className="text-xs text-gray-400 text-center">
            <span className="font-medium text-purple-400">
              Demo Credentials:
            </span>{" "}
            admin@cloudforge.com / password123
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}




