import Image from "next/image";

const Banner = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 pt-8">
        <div className="relative overflow-hidden border border-[#0b4f5b]/10 bg-white shadow-[0_20px_60px_-45px_rgba(6,57,67,0.6)] transition-transform duration-300 hover:-translate-y-0.5">
          <Image
            src="/banner.png"
            alt="Niramoy banner"
            width={1400}
            height={560}
            className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[480px]"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#063943]/10 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Banner;
