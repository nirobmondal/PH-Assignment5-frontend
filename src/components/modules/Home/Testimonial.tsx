import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "The medicine detail layout should make it easy to trust the product, understand the seller, and move into checkout without guessing.",
    name: "Ayesha Rahman",
    role: "Customer",
  },
  {
    quote:
      "A seller dashboard works best when stock, pricing, and order status are always visible in one flow.",
    name: "Tanvir Hasan",
    role: "Seller",
  },
];

const Testimonial = () => {
  return (
    <section className="container mx-auto px-4">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
          Why this layout works
        </p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Design each surface around the next action, not just the current view.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {testimonials.map((item) => (
          <Card
            key={item.name}
            className="border-emerald-200/50 bg-background/90"
          >
            <CardContent className="space-y-4 p-6">
              <p className="text-sm leading-7 text-muted-foreground">
                “{item.quote}”
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    {item.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
