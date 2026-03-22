import Link from "next/link";

export default function TJPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/characters"
          className="text-sm font-medium text-orange-600 hover:underline"
        >
          ← Back to characters
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Hero Profile
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">TJ</h1>
            <p className="mt-3 text-xl font-medium text-gray-700">
              The Reluctant Leader
            </p>

            <p className="mt-6 text-base leading-8 text-gray-600">
              TJ is an ordinary teenager drawn into an epic struggle much bigger
              than himself. His journey begins with uncertainty, but grows into
              courage, leadership, and purpose.
            </p>

            <p className="mt-4 text-base leading-8 text-gray-600">
              In the MVP, TJ is the first hero users can unlock through a Hero
              Pack code. His page introduces the world, the collectible journey,
              and the kind of story-and-challenge experience users can expect.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Create account
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                See how it works
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8">
            <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center text-gray-400">
              TJ artwork placeholder
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-semibold text-gray-900">Collectible:</span>{" "}
                Hero Pack unlock
              </p>
              <p>
                <span className="font-semibold text-gray-900">Includes:</span>{" "}
                story access, character profile, leadership challenge
              </p>
              <p>
                <span className="font-semibold text-gray-900">Status:</span>{" "}
                First hero in MVP
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
