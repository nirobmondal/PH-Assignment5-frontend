import Banner from "@/components/modules/Home/Banner";
import Categories from "@/components/modules/Home/Categories";
import FeaturedMedicines from "@/components/modules/Home/FeaturedMedicines";

export default function HomePage() {
  return (
    <main className="space-y-16 bg-[#f2faf9] pb-20">
      <Banner />
      <Categories />
      <FeaturedMedicines />
    </main>
  );
}
