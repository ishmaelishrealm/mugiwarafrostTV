import Link from "next/link";

interface HeroSectionProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
  showId?: string;
}

export default function HeroSection({ 
  title = "Solo Leveling",
  description = "In a world where hunters fight deadly monsters, one man's journey from weakling to unstoppable force will change everything.",
  backgroundImage = "https://images.unsplash.com/photo-1611162616305-4e3d31b14c03?auto=format&fit=crop&w=2000&q=80",
  showId = "1"
}: HeroSectionProps) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${backgroundImage}')`,
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-description line-clamp-3">
          {description}
        </p>
        <div className="flex gap-4 mt-6">
          <Link href={`/show/${showId}/episode/1`} className="btn-primary">
            Watch Now
          </Link>
          <Link href={`/show/${showId}`} className="btn-secondary">
            More Info
          </Link>
        </div>
      </div>
    </section>
  );
}
