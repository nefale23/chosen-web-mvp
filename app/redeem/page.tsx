"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type RedeemCode = {
  id: string;
  code: string;
  hero_slug: string;
  is_redeemed: boolean;
  redeemed_by: string | null;
  redeemed_at: string | null;
};

type Hero = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export default function RedeemPage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    setLoading(true);
    setMessage("");

    try {
      // 1. Confirm logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Please log in first.");
        router.replace("/login");
        setLoading(false);
        return;
      }

      const trimmedCode = code.trim().toUpperCase();

      if (!trimmedCode) {
        setMessage("Please enter a code.");
        setLoading(false);
        return;
      }

      // 2. Find redeem code
      const { data: redeemCode, error: codeError } = await supabase
        .from("redeem_codes")
        .select("*")
        .eq("code", trimmedCode)
        .maybeSingle<RedeemCode>();

      if (codeError) {
        console.error("Code lookup error:", codeError);
        setMessage(`Code lookup failed: ${codeError.message}`);
        setLoading(false);
        return;
      }

      if (!redeemCode) {
        setMessage("Invalid code.");
        setLoading(false);
        return;
      }

      // 3. Check if already redeemed
      if (redeemCode.is_redeemed) {
        setMessage("This code has already been redeemed.");
        setLoading(false);
        return;
      }

      // 4. Find hero
      const { data: hero, error: heroError } = await supabase
        .from("heroes")
        .select("*")
        .eq("slug", redeemCode.hero_slug)
        .maybeSingle<Hero>();

      if (heroError) {
        console.error("Hero lookup error:", heroError);
        setMessage(`Hero lookup failed: ${heroError.message}`);
        setLoading(false);
        return;
      }

      if (!hero) {
        setMessage("Hero not found for this code.");
        setLoading(false);
        return;
      }

      // 5. Insert unlock record
      const { error: unlockError } = await supabase.from("hero_unlocks").insert({
        user_id: user.id,
        hero_id: hero.id,
        unlocked_at: new Date().toISOString(),
      });

      if (unlockError) {
        // allow duplicate unlock case
        const lowerMessage = unlockError.message.toLowerCase();
        if (!lowerMessage.includes("duplicate") && !lowerMessage.includes("unique")) {
          console.error("Unlock insert error:", unlockError);
          setMessage(`Could not create unlock: ${unlockError.message}`);
          setLoading(false);
          return;
        }
      }

      // 6. Mark code redeemed
      const { error: updateError } = await supabase
        .from("redeem_codes")
        .update({
          is_redeemed: true,
          redeemed_by: user.id,
          redeemed_at: new Date().toISOString(),
        })
        .eq("id", redeemCode.id);

      if (updateError) {
        console.error("Code update error:", updateError);
        setMessage(`Unlocked, but code update failed: ${updateError.message}`);
        setLoading(false);
        return;
      }

      setMessage("Success! TJ unlocked.");
      router.replace("/heroes/tj");
    } catch (error) {
      console.error("Redeem error:", error);
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full border rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Redeem Your Hero Code</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter the code from your Hero Pack to unlock your collector experience.
        </p>

        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 mb-4"
        />

        <button
          onClick={handleRedeem}
          disabled={loading}
          className="w-full bg-black text-white rounded-lg px-4 py-3 font-medium disabled:opacity-50"
        >
          {loading ? "Redeeming..." : "Redeem Code"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}

        <p className="mt-4 text-xs text-center text-gray-500">
          Test code: TJ-TEST-001
        </p>
      </div>
    </main>
  );
}
