"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type Hero = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

type HeroUnlock = {
  id: string;
  user_id: string;
  hero_id: string;
  unlocked_at?: string | null;
};

export default function TJHeroPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<Hero | null>(null);
  const [unlock, setUnlock] = useState<HeroUnlock | null>(null);
  const [challengeDone, setChallengeDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      try {
        // 1. Check logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push("/login");
          return;
        }

        // 2. Load TJ hero
        const { data: heroData, error: heroError } = await supabase
          .from("heroes")
          .select("*")
          .eq("slug", "tj")
          .single();

        if (heroError || !heroData) {
          setErrorMessage("TJ hero data was not found.");
          setLoading(false);
          return;
        }

        setHero(heroData);

        // 3. Check if this user has unlocked TJ
        const { data: unlockData, error: unlockError } = await supabase
          .from("hero_unlocks")
          .select("*")
          .eq("user_id", user.id)
          .eq("hero_id", heroData.id)
          .maybeSingle();

        if (unlockError) {
          setErrorMessage("Could not verify your unlock status.");
          setLoading(false);
          return;
        }

        if (!unlockData) {
          router.push("/redeem");
          return;
        }

        setUnlock(unlockData);
      } catch (error) {
        console.error(error);
        setErrorMessage("Something went wrong loading TJ's page.");
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <p className="text-lg">Loading TJ...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full border rounded-2xl p-6 shadow-sm text-center">
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-sm text-gray-600">{errorMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <section className="border rounded-2xl p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
            Hero Unlocked
          </p>
          <h1 className="text-3xl font-bold mb-3">
            {hero?.name || "TJ"} — The First Epic Hero
          </h1>
          <p className="text-gray-700 mb-4">
            Welcome into TJ’s world. You have successfully unlocked your first
            collector experience.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold">Unlocked</p>
            </div>
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Unlocked At</p>
              <p className="font-semibold">
                {unlock?.unlocked_at
                  ? new Date(unlock.unlocked_at).toLocaleString()
                  : "Just now"}
              </p>
            </div>
          </div>
        </section>

        <section className="border rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-3">TJ Story</h2>
          <div className="space-y-4 text-gray-700 leading-7">
            <p>
              TJ never expected that ordinary life could open into something
              much bigger. But when mystery begins to break into the familiar,
              he discovers that courage is not about having all the answers.
            </p>
            <p>
              It is about stepping forward when the moment calls. His journey
              begins with uncertainty, but also with purpose, friendship, and
              the first signs that he is part of something epic.
            </p>
            <p>
              This is only the beginning of TJ’s path. As you continue, more of
              his world, his choices, and his leadership journey will unfold.
            </p>
          </div>
        </section>

        <section className="border rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-3">Leadership Challenge</h2>
          <p className="text-gray-700 mb-4">
            This week’s challenge: take one brave action you have been avoiding.
            It can be starting something important, speaking up, helping
            someone, or taking responsibility where it matters.
          </p>

          <div className="border rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-500 mb-1">Challenge Status</p>
            <p className="font-semibold">
              {challengeDone ? "Completed" : "Not completed yet"}
            </p>
          </div>

          <button
            onClick={() => setChallengeDone(true)}
            disabled={challengeDone}
            className="bg-black text-white rounded-lg px-4 py-3 font-medium disabled:opacity-50"
          >
            {challengeDone ? "Challenge Completed" : "Mark Challenge Complete"}
          </button>
        </section>

        <section className="border rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-3">Collection Marker</h2>
          <p className="text-gray-700">
            TJ is now in your collection. Later, this page will connect into
            your wider collection dashboard with locked, unlocked, and completed
            status across all heroes.
          </p>
        </section>
      </div>
    </main>
  );
}
