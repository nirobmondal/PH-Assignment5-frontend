// app/terms/page.tsx
"use client";

import Link from "next/link";
import {
  FileText,
  Scale,
  ShieldCheck,
  MailCheck,
  IndianRupee,
  RefreshCwOff,
  AlertTriangle,
  CreditCard,
  UserCheck,
  Store,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  const sections = [
    {
      icon: <Scale className="h-5 w-5" />,
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using Niramoy, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our platform.",
    },
    {
      icon: <MailCheck className="h-5 w-5" />,
      title: "2. Email Verification Required",
      content:
        "To place an order or use any of our core services (including seller registration), you must verify your email address. Unverified accounts have limited access and cannot complete transactions.",
    },
    {
      icon: <IndianRupee className="h-5 w-5" />,
      title: "3. Minimum Order Amount",
      content:
        "All orders must have a subtotal of at least ৳100 (BDT). Orders below this amount will not be processed. This policy helps us maintain efficient delivery operations.",
    },
    {
      icon: <RefreshCwOff className="h-5 w-5" />,
      title: "4. No Return / Refund Policy",
      content:
        "Due to the nature of pharmaceutical products and for safety reasons, Niramoy does not accept returns or offer refunds once an order has been confirmed and shipped. Please double‑check your order before payment. In case of damaged or incorrect products, contact support within 24 hours of delivery for a possible resolution (replacement only, no cash refund).",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "5. Product Authenticity",
      content:
        "All medicines sold on Niramoy are sourced from verified sellers and licensed manufacturers. However, we strongly advise you to consult a doctor before using any medication. Niramoy is not liable for misuse or adverse effects.",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "6. Payment & Security",
      content:
        "Payments are processed through Stripe, a PCI‑compliant gateway. We do not store your card details. By making a payment, you confirm that you are authorised to use the provided payment method.",
    },
    {
      icon: <UserCheck className="h-5 w-5" />,
      title: "7. Seller Responsibilities",
      content:
        "Sellers must provide accurate product information, maintain stock levels, and update order statuses in a timely manner. Failure to comply may result in account suspension.",
    },
    {
      icon: <Store className="h-5 w-5" />,
      title: "8. Account & Seller Registration",
      content:
        "You must be at least 18 years old to register. Sellers must provide valid business credentials. Niramoy reserves the right to verify any information and reject or terminate accounts that violate our policies.",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "9. Order Processing & Delivery",
      content:
        "Estimated delivery times are provided by sellers. Niramoy is not responsible for delays caused by courier services, weather, or other force majeure events. You may track your order in real‑time from your dashboard.",
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "10. Limitation of Liability",
      content:
        "Niramoy acts as an intermediary platform. We are not responsible for any direct, indirect, or consequential damages arising from the use of products purchased through our site. Our maximum liability is limited to the amount paid for the order.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-8 text-center md:mb-12">
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <FileText className="mr-1 h-3.5 w-3.5" />
            Legal Agreement
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            By using Niramoy, you agree to these terms.
          </p>
        </div>

        {/* Important Highlights Card */}
        <Card className="mb-10 border-amber-200 bg-amber-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Key Points to Remember
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-amber-800">
            <p>
              ✓ Minimum order amount: <strong>৳100</strong>
            </p>
            <p>
              ✓ <strong>No returns or refunds</strong> – please order carefully.
            </p>
            <p>
              ✓ <strong>Email verification required</strong> to place orders or
              sell.
            </p>
            <p>✓ Consult a doctor before using any medicine.</p>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <Card
              key={idx}
              className="border-gray-100 shadow-sm transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <span className="text-emerald-600">{section.icon}</span>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-700 leading-relaxed">
                  {section.content}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer note and back to home */}
        <Separator className="my-8" />
        <div className="text-center text-sm text-gray-500">
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:support@niramoy.com"
              className="font-medium text-emerald-600 hover:underline"
            >
              support@niramoy.com
            </a>
            .
          </p>
          <div className="mt-6">
            <Button asChild variant="outline" className="border-gray-300">
              <Link href="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
