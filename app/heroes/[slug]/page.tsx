"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type Hero = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  power?: string | null;
  core_trait?: string | null;
  challenge?: string | null;
  story?: string | null;
};

type HeroUnlock = {
  id: string;
  user_id: string;
  hero_id: string;
  unlocked_at: string | null;
};

export default function HeroPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [hero, setHero] = useState<Hero | null>(null);
  const [unlock, setUnlock] = useState<HeroUnlock | null>(null);

  useEffect(() => {
    const loadHeroPage = async () => {
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
          .eq("slug", slug)
          .maybeSingle<Hero>();

        if (heroError) {
          console.error("Hero fetch error:", heroError);
          setMessage("Could not load hero.");
          setLoading(false);
          return;
        }

        if (!heroData) {
          setMessage("Hero not found.");
          setLoading(false);
          return;
        }

        const { data: unlockData, error: unlockError } = await supabase
          .from("hero_unlocks")
          .select("*")
          .eq("user_id", user.id)
          .eq("hero_id", heroData.id)
          .maybeSingle<HeroUnlock>();

        if (unlockError) {
          console.error("Unlock fetch error:", unlockError);
          setMessage("Could not verify hero access.");
          setLoading(false);
          return;
        }

        if (!unlockData) {
          router.replace("/redeem");
          return;
        }

        setHero(heroData);
        setUnlock(unlockData);
      } catch (error) {
        console.error("Hero page error:", error);
        setMessage("Something went wrong loading this page.");
      } finally {
        setLoading(false);
      }
    };

    loadHeroPage();
  }, [slug, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <p className="text-lg">Loading hero...</p>
      </main>
    );
  }

  if (!hero) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <p className="text-lg">{message || "Hero not found."}</p>
      </main>
    );
  }

  const storyTitle =
    hero.slug === "tj" ? "Leadership Before Certainty" : `${hero.name} Story`;

  const fallbackDescription =
    hero.description ||
    `${hero.name} is part of The Chosen universe. This hero unlock opens the door to story, identity, and leadership challenges.`;

  const fallbackStory =
    hero.story ||
    `${hero.name} never expected ordinary life to open into something much bigger. But when mystery begins to break into the familiar, this hero discovers that courage is not about having all the answers. It is about stepping forward when the moment calls.`;

  const fallbackChallenge =
    hero.challenge || "Take one brave action before you feel fully ready.";

  const fallbackPower = hero.power || "Unknown Power";
  const fallbackCoreTrait = hero.core_trait || "Courage";

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <Link
            href="/characters"
            className="text-sm text-orange-400 hover:text-orange-300"
          >
            ← Back to characters
          </Link>
        </div>

        <section className="rounded-3xl border border-blue-900/50 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 shadow-2xl shadow-blue-950/30">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.25em] text-orange-400">
                Hero Unlocked
              </p>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {hero.name}
              </h1>

              <p className="text-2xl text-slate-300">
                {hero.slug === "tj" ? "The Reluctant Leader" : fallbackDescription}
              </p>

              <p className="text-lg leading-8 text-slate-300">
                {fallbackDescription}
              </p>

              <div className="flex gap-3 flex-wrap pt-2">
                <Link
                  href="/my-heroes"
                  className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-semibold text-black hover:bg-orange-400"
                >
                  View Collection
                </Link>

                <Link
                  href="/characters"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-5 py-3 font-semibold text-white hover:bg-white/5"
                >
                  Meet the Heroes
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2 pt-4">
                <div className="rounded-2xl border border-slate-700 bg-black/30 p-5">
                  <p className="text-sm text-slate-400 mb-2">Status</p>
                  <p className="text-2xl font-semibold text-green-400">Unlocked</p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-black/30 p-5">
                  <p className="text-sm text-slate-400 mb-2">Unlocked At</p>
                  <p className="text-lg font-semibold">
                    {unlock?.unlocked_at
                      ? new Date(unlock.unlocked_at).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-800/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
              {hero.image_url ? (
                <img
                  src={hero.image_url}
                  alt={hero.name}
                  className="w-full max-h-[520px] object-contain rounded-2xl"
                />
              ) : (
                <div className="min-h-[420px] rounded-2xl border border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-lg">
                  {hero.name} artwork placeholder
                </div>
              )}

              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <p>
                  <span className="font-semibold text-white">Collectible:</span>{" "}
                  Hero Pack unlock
                </p>
                <p>
                  <span className="font-semibold text-white">Power:</span>{" "}
                  {fallbackPower}
                </p>
                <p>
                  <span className="font-semibold text-white">Core Trait:</span>{" "}
                  {fallbackCoreTrait}
                </p>
                <p>
                  <span className="font-semibold text-white">Includes:</span>{" "}
                  story access, character profile, leadership challenge
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-blue-900/50 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-yellow-400 mb-5">{storyTitle}</h2>

          <div className="space-y-5 text-lg leading-9 text-slate-300">
            {fallbackStory.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-blue-900/50 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-5">Leadership Challenge</h2>

          <p className="text-lg leading-8 text-slate-300 mb-6">
            {fallbackChallenge}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-black/30 p-5">
              <p className="text-sm text-slate-400 mb-2">Challenge Power</p>
              <p className="text-xl font-semibold text-blue-400">{fallbackPower}</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-black/30 p-5">
              <p className="text-sm text-slate-400 mb-2">Leadership Trait</p>
              <p className="text-xl font-semibold text-green-400">
                {fallbackCoreTrait}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 px-6 py-5 text-black">
            <p className="text-sm uppercase tracking-[0.2em] font-semibold mb-2">
              Challenge
            </p>
            <p className="text-2xl font-bold">{fallbackChallenge}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-blue-900/50 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Collection Marker</h2>

          <p className="text-lg leading-8 text-slate-300 mb-6">
            {hero.name} is now in your collection. As more heroes unlock across The
            Chosen universe, your collection will grow into a full story journey of
            characters, powers, and leadership moments.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link
              href="/my-heroes"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-slate-200"
            >
              Go to Collection Dashboard
            </Link>

            <Link
              href="/redeem"
              className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-5 py-3 font-semibold text-white hover:bg-white/5"
            >
              Redeem Another Code
            </Link>
          </div>
        </section>

        <section className="text-center pt-2">
          <p className="text-lg tracking-wide text-slate-400">
            Scan. Unlock. Become.
          </p>
        </section>
      </div>
    </main>
  );
}
