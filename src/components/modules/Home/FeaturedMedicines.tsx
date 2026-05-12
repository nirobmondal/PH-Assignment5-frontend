import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Star } from "lucide-react";

const featuredMedicines = [
  {
    name: "Napa 500",
    seller: "Green Pharmacy",
    price: 18,
    rating: 4.8,
    badge: "Best seller",
  },
  {
    name: "Vitamin C+",
    seller: "Nature Life",
    price: 28,
    rating: 4.7,
    badge: "High demand",
  },
  {
    name: "Antacid Relief",
    seller: "Wellness Hub",
    price: 24,
    rating: 4.9,
    badge: "Editor's pick",
  },
];

const FeaturedMedicines = () => {
  return (
    <section className="container mx-auto px-4">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Featured medicines
          </p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Put the strongest products front and center.
          </h2>
        </div>
        <Button asChild variant="outline" className="hidden md:inline-flex">
          <Link href="/medicine">View all</Link>
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {featuredMedicines.map((medicine) => (
          <Card
            key={medicine.name}
            className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="h-44 bg-[linear-gradient(135deg,_rgba(16,185,129,0.16),_rgba(236,253,245,1))]" />
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge className="mb-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    {medicine.badge}
                  </Badge>
                  <CardTitle className="text-lg">{medicine.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {medicine.seller}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium text-foreground">
                    {medicine.rating}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">From</p>
                <p className="text-2xl font-semibold text-emerald-700">
                  ${medicine.price}
                </p>
              </div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/medicine">View</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedMedicines;
