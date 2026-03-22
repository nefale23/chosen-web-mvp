import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-amber-400">
            The Chosen
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Collect the heroes.
            <br />
            Unlock the story.
            <br />
            Build the leader within.
          </h1>

          <p className="mb-8 text-lg leading-8 text-zinc-300">
            A story universe where physical Hero Packs unlock exclusive digital
            stories, missions, and leadership challenges.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/characters"
              className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300"
            >
              Explore Characters
            </Link>

            <Link
              href="/characters/tj"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10"
            >
              Start With TJ
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-zinc-950">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-3 text-xl font-semibold">Story</h2>
            <p className="text-zinc-300">
              Unlock exclusive story drops that expand each hero’s journey.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-3 text-xl font-semibold">Collectibles</h2>
            <p className="text-zinc-300">
              Each Hero Pack becomes a gateway into a bigger universe.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-3 text-xl font-semibold">Leadership Missions</h2>
            <p className="text-zinc-300">
              Complete character-based challenges that build real-world
              leadership.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
