import Link from "next/link";

const heroes = [
  {
    name: "TJ",
    slug: "tj",
    title: "The Reluctant Leader",
    description:
      "A brave but ordinary teen called into an extraordinary mission. TJ is the gateway into The Chosen universe.",
    status: "Live",
  },
  {
    name: "Ethan",
    slug: "ethan",
    title: "The Loyal Protector",
    description:
      "Strong, dependable, and courageous. Ethan stands firm when the team faces danger.",
    status: "Coming Soon",
  },
  {
    name: "Tumi",
    slug: "tumi",
    title: "The Bold Visionary",
    description:
      "Creative, energetic, and determined. Tumi brings heart and action to the journey.",
    status: "Coming Soon",
  },
  {
    name: "Pippa",
    slug: "pippa",
    title: "The Flame of Hope",
    description:
      "Resilient and full of inner fire. Pippa reminds the team what it means to keep going.",
    status: "Coming Soon",
  },
  {
    name: "Fang",
    slug: "fang",
    title: "The Strategic Mind",
    description:
      "Sharp, thoughtful, and observant. Fang sees patterns others miss.",
    status: "Coming Soon",
  },
  {
    name: "Ana",
    slug: "ana",
    title: "The Courageous Heart",
    description:
      "Compassionate and fearless. Ana leads with conviction and quiet strength.",
    status: "Coming Soon",
  },
];

export default function CharactersPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Meet the heroes
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Enter The Chosen universe
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Each hero unlocks a new part of the story world — with character
            lore, collectible moments, story episodes, and leadership
            challenges.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {heroes.map((hero) => (
            <div
              key={hero.slug}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{hero.name}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    hero.status === "Live"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {hero.status}
                </span>
              </div>

              <p className="text-sm font-medium text-orange-600">{hero.title}</p>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {hero.description}
              </p>

              <div className="mt-6">
                {hero.slug === "tj" ? (
                  <Link
                    href={`/characters/${hero.slug}`}
                    className="inline-flex rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    View hero
                  </Link>
                ) : (
                  <span className="inline-flex rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
