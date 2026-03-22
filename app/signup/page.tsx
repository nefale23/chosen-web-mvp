"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setMessage("Signup successful! You can now log in.");
      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Something went wrong during signup.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6 border rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Create account</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          className="w-full border px-4 py-3 rounded-lg mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full border px-4 py-3 rounded-lg mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </div>
    </main>
  );
}
