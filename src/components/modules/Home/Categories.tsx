import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pill,
  HeartPulse,
  Baby,
  Sparkles,
  Salad,
  Activity,
} from "lucide-react";

const categories = [
  { title: "Pain Relief", icon: Activity, count: "42 medicines" },
  { title: "Digestive Care", icon: Salad, count: "31 medicines" },
  { title: "Supplements", icon: Sparkles, count: "55 medicines" },
  { title: "Cold & Allergy", icon: HeartPulse, count: "28 medicines" },
  { title: "Baby Care", icon: Baby, count: "19 medicines" },
  { title: "Daily Essentials", icon: Pill, count: "64 medicines" },
];

const Categories = () => {
  return (
    <section className="container mx-auto px-4">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Browse by need
          </p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Category-first browsing makes the marketplace easier to scan.
          </h2>
        </div>
        <Badge
          variant="secondary"
          className="hidden rounded-full px-3 py-1 md:inline-flex"
        >
          Faster decision making
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Card
              key={category.title}
              className="transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-medium">
                  {category.title}
                </CardTitle>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {category.count}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
