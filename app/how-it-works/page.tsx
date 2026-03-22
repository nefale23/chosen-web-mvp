export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Get a Hero Pack",
      description:
        "Buy or receive a Chosen Hero Pack linked to a specific character.",
    },
    {
      number: "02",
      title: "Create an account",
      description:
        "Sign up to begin your collector journey and save your progress.",
    },
    {
      number: "03",
      title: "Redeem your code",
      description:
        "Enter the unique code from your pack to unlock digital content.",
    },
    {
      number: "04",
      title: "Read and complete challenges",
      description:
        "Access exclusive story content, discover the hero, and complete a leadership challenge.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            How it works
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            From physical collectible to digital story world
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            The Chosen begins with a collectible hero and expands into stories,
            character unlocks, and leadership missions.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-bold text-orange-600">{step.number}</p>
              <h2 className="mt-2 text-2xl font-semibold">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
