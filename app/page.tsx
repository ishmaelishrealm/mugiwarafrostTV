import Link from "next/link";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Ishanime</h1>
        <p className="text-xl text-muted-foreground mb-8">Start building your amazing anime streaming platform here!</p>
        
        <Link 
          href="/anime-player" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Watch Anime Demo
        </Link>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Bunny.net Library ID: 506159</p>
          <p>Video ID: 1f9a121e-c681-410e-b309-967ef313d1e8</p>
        </div>
      </div>
    </div>
  );
};

export default Index;