"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

type ChallengeProgress = {
  id: string;
  user_id: string;
  hero_slug: string;
  challenge_key: string;
  is_completed: boolean;
  completed_at?: string | null;
};

export default function TJHeroPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<Hero | null>(null);
  const [unlock, setUnlock] = useState<HeroUnlock | null>(null);
  const [challengeProgress, setChallengeProgress] =
    useState<ChallengeProgress | null>(null);
  const [savingChallenge, setSavingChallenge] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/login");
          return;
        }

        const { data: heroData, error: heroError } = await supabase
          .from("heroes")
          .select("*")
          .eq("slug", "tj")
          .maybeSingle<Hero>();

        if (heroError) {
          console.error("Hero load error:", heroError);
          setErrorMessage(`TJ hero load failed: ${heroError.message}`);
          setLoading(false);
          return;
        }

        if (!heroData) {
          setErrorMessage("TJ hero data was not found.");
          setLoading(false);
          return;
        }

        setHero(heroData);

        const { data: unlockData, error: unlockError } = await supabase
          .from("hero_unlocks")
          .select("*")
          .eq("user_id", user.id)
          .eq("hero_id", heroData.id)
          .maybeSingle<HeroUnlock>();

        if (unlockError) {
          console.error("Unlock check error:", unlockError);
          setErrorMessage(`Could not verify unlock status: ${unlockError.message}`);
          setLoading(false);
          return;
        }

        if (!unlockData) {
          router.replace("/redeem");
          return;
        }

        setUnlock(unlockData);

        const { data: progressData, error: progressError } = await supabase
          .from("user_challenge_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("hero_slug", "tj")
          .eq("challenge_key", "first-brave-action")
          .maybeSingle<ChallengeProgress>();

        if (progressError) {
          console.error("Challenge progress load error:", progressError);
        } else if (progressData) {
          setChallengeProgress(progressData);
        }
      } catch (error) {
        console.error("TJ page load error:", error);
        setErrorMessage("Something went wrong loading TJ's page.");
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [router]);

  const handleCompleteChallenge = async () => {
    try {
      setSavingChallenge(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const payload = {
        user_id: user.id,
        hero_slug: "tj",
        challenge_key: "first-brave-action",
        is_completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("user_challenge_progress")
        .upsert(payload, {
          onConflict: "user_id,hero_slug,challenge_key",
        })
        .select()
        .single<ChallengeProgress>();

      if (error) {
        console.error("Challenge save error:", error);
        alert(`Could not save challenge: ${error.message}`);
        return;
      }

      setChallengeProgress(data);
    } catch (error) {
      console.error("Challenge complete error:", error);
      alert("Something went wrong saving your challenge.");
    } finally {
      setSavingChallenge(false);
    }
  };

  const challengeDone = !!challengeProgress?.is_completed;

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
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
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
            </div>

            <Link
              href="/collection"
              className="border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              View Collection
            </Link>
          </div>

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
              TJ never expected that ordinary life could open into something much
              bigger. But when mystery begins to break into the familiar, he
              discovers that courage is not about having all the answers.
            </p>
            <p>
              It is about stepping forward when the moment calls. His journey
              begins with uncertainty, but also with purpose, friendship, and the
              first signs that he is part of something epic.
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
            It can be starting something important, speaking up, helping someone,
            or taking responsibility where it matters.
          </p>

          <div className="border rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-500 mb-1">Challenge Status</p>
            <p className="font-semibold">
              {challengeDone ? "Completed" : "Not completed yet"}
            </p>
            {challengeDone && challengeProgress?.completed_at && (
              <p className="text-sm text-gray-500 mt-2">
                Completed on {new Date(challengeProgress.completed_at).toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={handleCompleteChallenge}
            disabled={challengeDone || savingChallenge}
            className="bg-black text-white rounded-lg px-4 py-3 font-medium disabled:opacity-50"
          >
            {savingChallenge
              ? "Saving..."
              : challengeDone
              ? "Challenge Completed"
              : "Mark Challenge Complete"}
          </button>
        </section>

        <section className="border rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-3">Collection Marker</h2>
          <p className="text-gray-700 mb-4">
            TJ is now in your collection. Your dashboard will show whether heroes
            are locked, unlocked, or completed.
          </p>

          <Link
            href="/collection"
            className="inline-block bg-black text-white rounded-lg px-4 py-3 font-medium"
          >
            Go to Collection Dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}
