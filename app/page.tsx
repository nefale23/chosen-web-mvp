import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      
      {/* HERO SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          The Chosen Universe
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
          Story. Collectibles. Leadership.
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Enter a new kind of story world where physical collectibles unlock
          digital adventures, character journeys, and real-world leadership
          challenges.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/characters"
            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Meet the Heroes
          </Link>

          <Link
            href="/how-it-works"
            className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            How it Works
          </Link>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          
          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold">Collect Heroes</h3>
            <p className="mt-3 text-sm text-gray-600">
              Each Hero Pack connects to a character in The Chosen universe.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold">Unlock Stories</h3>
            <p className="mt-3 text-sm text-gray-600">
              Use your code to unlock exclusive story content and character lore.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold">Lead in Real Life</h3>
            <p className="mt-3 text-sm text-gray-600">
              Complete leadership challenges inspired by each hero.
            </p>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold">
            Start your journey
          </h2>

          <p className="mt-4 text-gray-600">
            Create an account and begin unlocking your first hero.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Create account
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
