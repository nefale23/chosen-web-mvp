"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type HeroUnlock = {
  hero_id: string;
  unlocked_at: string;
};

type Hero = {
  id: string;
  slug: string;
  name: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (!data.session || !data.user) {
        setMessage("Login worked, but no session was created. Please try again.");
        setLoading(false);
        return;
      }

      const user = data.user;

      setMessage("Login successful! Checking your unlocked heroes...");

      // 1. Check whether this user has already unlocked a hero
      const { data: unlocks, error: unlocksError } = await supabase
        .from("hero_unlocks")
        .select("hero_id, unlocked_at")
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: true })
        .limit(1);

      if (unlocksError) {
        console.error("Unlock lookup error:", unlocksError);
        setMessage("Logged in, but could not check unlocks. Sending you to redeem.");
        router.replace("/redeem");
        return;
      }

      // 2. If they already unlocked a hero, send them there
      if (unlocks && unlocks.length > 0) {
        const firstUnlock = unlocks[0] as HeroUnlock;

        const { data: hero, error: heroError } = await supabase
          .from("heroes")
          .select("id, slug, name")
          .eq("id", firstUnlock.hero_id)
          .maybeSingle<Hero>();

        if (heroError) {
          console.error("Hero lookup error:", heroError);
          setMessage("Logged in, but could not load your hero. Sending you to redeem.");
          router.replace("/redeem");
          return;
        }

        if (hero?.slug) {
          router.replace(`/heroes/${hero.slug}`);
          return;
        }
      }

      // 3. No unlock found yet → go redeem
      router.replace("/redeem");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong during login.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6 border rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg mb-4"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}
      </div>
    </main>
  );
}
