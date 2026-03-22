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

  const displayImage =
    hero.image_url || (hero.slug === "tj" ? "/heroes/tj-card.png" : "");

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div
