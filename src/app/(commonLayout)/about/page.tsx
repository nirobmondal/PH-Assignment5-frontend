// app/about/page.tsx
"use client";

import Link from "next/link";
import {
  Shield,
  ShoppingCart,
  CreditCard,
  Truck,
  Store,
  Users,
  HeartHandshake,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  const reasons = [
    {
      icon: <Store className="h-8 w-8 text-emerald-600" />,
      title: "Multiple Sellers, One Platform",
      description:
        "Niramoy brings together trusted sellers under one roof. Each seller is verified before they can list their medicines.",
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "100% Authentic Medicines",
      description:
        "Every medicine sold on Niramoy is genuine and sourced from licensed manufacturers and distributors.",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-emerald-600" />,
      title: "Secure Stripe Payments",
      description:
        "Pay with confidence using Stripe's industry‑leading secure payment gateway. Your financial data is always protected.",
    },
    {
      icon: <Truck className="h-8 w-8 text-emerald-600" />,
      title: "Real‑Time Order Tracking",
      description:
        "From order placement to delivery, track your medicine every step of the way. Sellers update status as your order progresses.",
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-emerald-600" />,
      title: "Seller Empowerment",
      description:
        "Sellers get a dedicated dashboard to create, update, and delete medicines, manage inventory, and update order statuses effortlessly.",
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      title: "Customer First",
      description:
        "Our support team is always ready to help you with any issue – from medicine selection to delivery concerns.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero / About Niramoy Section */}
      <section className="relative overflow-hidden px-4 py-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Authentic Medicine Platform
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
              About Niramoy
            </h1>
            <p className="mt-4 max-w-2xl text-base text-gray-600 sm:text-lg md:text-xl">
              Niramoy is a trusted marketplace where verified sellers offer
              genuine medicines, and customers can order with confidence.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature highlights - more detailed than why choose us */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <Store className="h-5 w-5 text-emerald-700" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                For Sellers
              </h3>
              <p className="text-sm text-gray-600">
                Create a seller profile, list medicines, manage inventory,
                update order statuses – all from a dedicated dashboard.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <ShoppingCart className="h-5 w-5 text-emerald-700" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                For Customers
              </h3>
              <p className="text-sm text-gray-600">
                Browse medicines, place orders, pay securely via Stripe, and
                track your order until delivery.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <Truck className="h-5 w-5 text-emerald-700" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                End‑to‑End Transparency
              </h3>
              <p className="text-sm text-gray-600">
                Real‑time order tracking and status updates from sellers ensure
                you always know where your medicine is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              Why Choose Niramoy?
            </h2>
            <p className="mt-3 text-base text-gray-600 sm:text-lg">
              We make buying and selling medicines safe, simple, and reliable.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, index) => (
              <Card
                key={index}
                className="border-gray-100 transition-all hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="mb-2">{reason.icon}</div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {reason.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600">
                    {reason.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Buy Medicine Button */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 shadow-lg md:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Ready to get your medicines?
            </h2>
            <p className="mt-3 text-base text-emerald-50 sm:text-lg">
              Explore thousands of genuine products from trusted sellers.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 bg-white text-emerald-700 hover:bg-gray-100 hover:text-emerald-800"
            >
              <Link href="/medicine">
                Browse Medicines
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
