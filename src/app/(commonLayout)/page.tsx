import Banner from "@/components/modules/Home/Banner";
import Categories from "@/components/modules/Home/Categories";
import FeaturedMedicines from "@/components/modules/Home/FeaturedMedicines";

export default async function HomePage() {
  return (
    <main className="flex flex-col gap-10 py-10">
      <Banner />
      <Categories />
      <FeaturedMedicines />
    </main>
  );
}
