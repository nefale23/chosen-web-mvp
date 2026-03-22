"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

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
};

type HeroCard = {
  name: string;
  slug: string;
  description: string;
  status: "locked" | "unlocked" | "completed";
};

const starterHeroes: Omit<HeroCard, "status">[] = [
  {
    name: "TJ",
    slug: "tj",
    description: "The first epic hero. Courage, purpose, and the beginning of the journey.",
  },
  {
    name: "Ethan",
    slug: "ethan",
    description: "Coming soon.",
  },
  {
    name: "Tumi",
    slug: "tumi",
    description: "Coming soon.",
  },
  {
    name: "Pippa",
    slug: "pippa",
    description: "Coming soon.",
  },
  {
    name: "Fang",
    slug: "fang",
    description: "Coming soon.",
  },
  {
    name: "Ana",
    slug: "ana",
    description: "Coming soon.",
  },
];

export default function CollectionPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<HeroCard[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadCollection = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/login");
          return;
        }

        const { data: heroesData, error: heroesError } = await supabase
          .from("heroes")
          .select("*");

        if (heroesError) {
          console.error("Heroes load error:", heroesError);
        }

        const { data: unlocksData, error: unlocksError } = await supabase
          .from("hero_unlocks")
          .select("*")
          .eq("user_id", user.id);

        if (unlocksError) {
          console.error("Unlocks load error:", unlocksError);
          setErrorMessage(`Could not load collection: ${unlocksError.message}`);
          setLoading(false);
          return;
        }

        const { data: progressData, error: progressError } = await supabase
          .from("user_challenge_progress")
          .select("*")
          .eq("user_id", user.id);

        if (progressError) {
          console.error("Progress load error:", progressError);
        }

        const realHeroes = (heroesData as Hero[] | null) ?? [];
        const unlocks = (unlocksData as HeroUnlock[] | null) ?? [];
        const progress = (progressData as ChallengeProgress[] | null) ?? [];

        const unlockedHeroIds = new Set(unlocks.map((u) => u.hero_id));
        const completedHeroSlugs = new Set(
          progress.filter((p) => p.is_completed).map((p) => p.hero_slug)
        );

        const merged = starterHeroes.map((starter) => {
          const dbHero = realHeroes.find((h) => h.slug === starter.slug);
          const isUnlocked = dbHero ? unlockedHeroIds.has(dbHero.id) : false;
          const isCompleted = completedHeroSlugs.has(starter.slug);

          let status: "locked" | "unlocked" | "completed" = "locked";

          if (isCompleted) {
            status = "completed";
          } else if (isUnlocked) {
            status = "unlocked";
          }

          return {
            ...starter,
            status,
          };
        });

        setCards(merged);
      } catch (error) {
        console.error("Collection load error:", error);
        setErrorMessage("Something went wrong loading your collection.");
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [router]);

  const statusClasses: Record<HeroCard["status"], string> = {
    locked: "bg-gray-100 text-gray-700 border-gray-200",
    unlocked: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <p className="text-lg">Loading collection...</p>
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

  const unlockedCount = cards.filter((c) => c.status !== "locked").length;
  const completedCount = cards.filter((c) => c.status === "completed").length;

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="border rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                Collector Dashboard
              </p>
              <h1 className="text-3xl font-bold mb-3">Your Collection</h1>
              <p className="text-gray-700">
                Track which heroes are locked, unlocked, and completed.
              </p>
            </div>

            <Link
              href="/heroes/tj"
              className="border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Back to TJ
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mt-6">
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Total Heroes</p>
              <p className="font-semibold text-2xl">{cards.length}</p>
            </div>
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Unlocked</p>
              <p className="font-semibold text-2xl">{unlockedCount}</p>
            </div>
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="font-semibold text-2xl">{completedCount}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.slug} className="border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold">{card.name}</h2>
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${statusClasses[card.status]}`}
                >
                  {card.status}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-5">{card.description}</p>

              {card.slug === "tj" && card.status !== "locked" ? (
                <Link
                  href="/heroes/tj"
                  className="inline-block bg-black text-white rounded-lg px-4 py-3 text-sm font-medium"
                >
                  Open TJ
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-block bg-gray-200 text-gray-500 rounded-lg px-4 py-3 text-sm font-medium cursor-not-allowed"
                >
                  {card.status === "locked" ? "Locked" : "Coming Soon"}
                </button>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
