import { HomepageFilters } from "../filter/homepage-filters";

export function HeroSection() {
  return (
    <section
      className="relative flex-1 bg-cover bg-center"
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 h-full flex items-center px-6 md:px-10">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-10 items-center py-20">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white uppercase leading-tight">
              Get your dream car at unbeatable rates
            </h1>
          </div>
          <HomepageFilters />
        </div>
      </div>
    </section>
  );
}
