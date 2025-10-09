import HeadNav from "@/components/HeadNav";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <HeadNav />

      <section className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
          Welcome to Ishrealmanime
        </h1>
        <p className="text-gray-400 max-w-lg">
          Stream your favorite anime in high quality — powered by our ninja-tier performance.
        </p>
      </section>
    </main>
  );
}