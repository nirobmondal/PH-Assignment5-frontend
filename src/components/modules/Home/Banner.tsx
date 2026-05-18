import Image from "next/image";

const Banner = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl border border-[#0b4f5b]/10 bg-white/60 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          {/* Responsive aspect ratio container */}
          <div className="relative w-full" style={{ aspectRatio: "16 / 7.5" }}>
            <Image
              src="/hero-banner.png"
              alt="Niramoy banner - your trusted medicine partner"
              fill
              className="object-cover object-center w-full"
              preload={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
            />
          </div>
          {/* Optional gradient overlay for better text contrast if any */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#063943]/5 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Banner;
