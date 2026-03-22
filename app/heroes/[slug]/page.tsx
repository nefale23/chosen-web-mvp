"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type Hero = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  power?: string;
  core_trait?: string;
  challenge?: string;
  story?: string;
};

export default function HeroPage() {
  const router = useRouter();
  const params = useParams();

  const slug = params?.slug as string;

  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadHero = async () => {
      try {
        // 1. Check user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        // 2. Get hero
        const { data: heroData, error: heroError } = await supabase
          .from("heroes")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (heroError || !heroData) {
          setMessage("Hero not found.");
          setLoading(false);
          return;
        }

        // 3. Check unlock
        const { data: unlock } = await supabase
          .from("hero_unlocks")
          .select("*")
          .eq("user_id", user.id)
          .eq("hero_id", heroData.id)
          .maybeSingle();

        if (!unlock) {
          router.replace("/redeem");
          return;
        }

        setHero(heroData);
      } catch (err) {
        console.error(err);
        setMessage("Something went wrong.");
      }

      setLoading(false);
    };

    loadHero();
  }, [slug, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading hero...</p>
      </main>
    );
  }

  if (!hero) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>{message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* HERO HEADER */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{hero.name}</h1>
          <p className="text-lg text-gray-300">
            The Reluctant Leader
          </p>

          {hero.image_url && (
            <img
              src={hero.image_url}
              alt={hero.name}
              className="mx-auto rounded-xl shadow-lg max-h-[400px]"
            />
          )}
        </section>

        {/* STORY SECTION */}
        <section className="bg-gray-900 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-yellow-400">
            Leadership Before Certainty
          </h2>

          <p className="text-gray-300 leading-relaxed">
            {hero.story ||
              "TJ never set out to lead. But when everything began to fall apart, he was the one who stepped forward."}
          </p>
        </section>

        {/* POWER + TRAITS */}
        <section className="grid md:grid-cols-2 gap-4">

          <div className="bg-gray-900 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Power
            </h3>
            <p>{hero.power || "Storm Energy ⚡"}</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              Core Trait
            </h3>
            <p>{hero.core_trait || "Responsibility"}</p>
          </div>

        </section>

        {/* CHALLENGE */}
        <section className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">
            Challenge
          </h3>

          <p className="text-lg font-medium">
            {hero.challenge || "Lead Before You Feel Ready"}
          </p>
        </section>

        {/* CTA */}
        <section className="text-center text-gray-400">
          <p className="text-sm tracking-wide">
            Scan. Unlock. Become.
          </p>
        </section>

      </div>
    </main>
  );
}
