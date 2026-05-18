// app/delivery-info/page.tsx
"use client";

import {
  MapPin,
  Clock,
  Truck,
  PackageCheck,
  ShoppingBag,
  Ship,
  CheckCircle,
  Globe,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeliveryInfoPage() {
  const steps = [
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "Place Order",
      description: "You place an order and complete payment.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Processing",
      description: "Seller confirms and prepares your medicine.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Shipped",
      description: "Order handed over to our delivery partner.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Delivered",
      description: "Medicine reaches your doorstep.",
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <Truck className="mr-1 h-3.5 w-3.5" />
            Fast & Reliable
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Delivery Information
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
            We deliver across Bangladesh with speed, care, and transparency.
          </p>
        </div>

        {/* Coverage & Timeline Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Card className="border-gray-100 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-xl">Delivery Coverage</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Niramoy delivers to <strong>all 64 districts</strong> of
                Bangladesh. Whether you're in a metropolitan city or a rural
                area, we bring authentic medicines to your doorstep.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
                <MapPin className="h-4 w-4" />
                <span>Serving nationwide – no location is too remote.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-xl">
                  Estimated Delivery Time
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-700">Inside Dhaka</span>
                <span className="text-emerald-700">2–3 business days</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-700">Outside Dhaka</span>
                <span className="text-emerald-700">3–5 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Remote areas</span>
                <span className="text-emerald-700">5–7 business days</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                *Business days exclude Fridays and national holidays.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Process Timeline */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
            Order Delivery Process
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center text-center"
              >
                {/* Connector line (hidden on last item) */}
                {idx < steps.length - 1 && (
                  <div className="absolute left-2/3 top-8 hidden w-full border-t-2 border-dashed border-gray-300 lg:block" />
                )}
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${step.color}`}
                >
                  {step.icon}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-gray-100 bg-white shadow-sm">
            <CardContent className="p-5 text-center">
              <PackageCheck className="mx-auto h-8 w-8 text-emerald-600" />
              <h3 className="mt-2 font-semibold">Free Shipping?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Orders above ৳1000 qualify for free standard delivery.
                Otherwise, a flat fee of ৳60 applies.
              </p>
            </CardContent>
          </Card>
          <Card className="border-gray-100 bg-white shadow-sm">
            <CardContent className="p-5 text-center">
              <Ship className="mx-auto h-8 w-8 text-emerald-600" />
              <h3 className="mt-2 font-semibold">Track Your Order</h3>
              <p className="mt-1 text-sm text-gray-600">
                Real‑time tracking available from your account dashboard. You'll
                also receive SMS/email updates.
              </p>
            </CardContent>
          </Card>
          <Card className="border-gray-100 bg-white shadow-sm">
            <CardContent className="p-5 text-center">
              <Clock className="mx-auto h-8 w-8 text-emerald-600" />
              <h3 className="mt-2 font-semibold">Delivery Partners</h3>
              <p className="mt-1 text-sm text-gray-600">
                We work with RedX, Pathao, Sundarban, and local couriers to
                ensure fast, reliable service.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Note / Disclaimer */}
        <div className="mt-10 rounded-lg border border-amber-100 bg-amber-50 p-4 text-center text-sm text-amber-800">
          <p>
            ⚠️ Delivery times may vary due to weather, strikes, or other
            unforeseen circumstances. We'll keep you updated every step of the
            way.
          </p>
        </div>
      </div>
    </main>
  );
}
