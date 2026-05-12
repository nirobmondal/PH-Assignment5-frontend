import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="container mx-auto px-4 pt-8">
      <Card className="overflow-hidden border-emerald-200/60 bg-[radial-gradient(circle_at_top_right,_rgba(110,231,183,0.24),_transparent_32%),linear-gradient(135deg,_#f0fdf4_0%,_#ffffff_45%,_#ecfccb_100%)] shadow-sm">
        <div className="grid gap-8 p-6 md:grid-cols-[1.15fr_0.85fr] md:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-600">
                Niramoy marketplace
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                OTC only
              </Badge>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Your trusted online medicine shop
              </p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                Find the right medicine faster, with clearer seller trust and
                stock visibility.
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                Build the storefront around confidence: browse categories,
                compare sellers, review product details, and move into checkout
                without friction.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href="/medicine">
                  Explore medicines
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/register">Start selling</Link>
              </Button>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {[
                { label: "Verified sellers", Icon: ShieldCheck },
                { label: "Fast dispatch", Icon: Truck },
                { label: "Rated products", Icon: Star },
              ].map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur"
                >
                  <Icon className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-8 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="relative w-full max-w-md space-y-4 rounded-[2rem] border bg-white/80 p-5 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Top picks
                  </p>
                  <h2 className="text-lg font-semibold">Featured this week</h2>
                </div>
                <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Live stock
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Pain relief", "Green Pharmacy"],
                  ["Digestive care", "Wellness Hub"],
                  ["Supplements", "Nature Life"],
                  ["Allergy support", "HealthMart"],
                ].map(([title, seller]) => (
                  <div key={title} className="rounded-2xl border p-4">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">{seller}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Hero;
