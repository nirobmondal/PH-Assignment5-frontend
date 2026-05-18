// app/faq/page.tsx
"use client";

import Link from "next/link";
import {
  HelpCircle,
  ShoppingCart,
  Store,
  CreditCard,
  Truck,
  MailCheck,
  RefreshCw,
  IndianRupee,
  Shield,
  UserCheck,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FAQPage() {
  const faqs = [
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      question: "How do I place an order?",
      answer:
        "Browse medicines, add them to your cart, proceed to checkout, and pay using Stripe. You'll receive order confirmation via email.",
    },
    {
      icon: <MailCheck className="h-5 w-5" />,
      question: "Do I need to verify my email before ordering?",
      answer:
        "Yes. Email verification is mandatory to place any order or register as a seller. Check your inbox after sign‑up and click the verification link.",
    },
    {
      icon: <IndianRupee className="h-5 w-5" />,
      question: "Is there a minimum order amount?",
      answer:
        "Yes. All orders must be at least ৳100 (BDT). Orders below this amount cannot be processed.",
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      question: "What is your return and refund policy?",
      answer:
        "Due to safety and hygiene reasons, we do not accept returns or offer refunds once an order is confirmed and shipped. If you receive a damaged or incorrect product, contact support within 24 hours – we may offer a replacement (no cash refund).",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit/debit cards (Visa, Mastercard, American Express) through Stripe. Payments are secure and PCI‑compliant.",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      question: "How can I track my order?",
      answer:
        "Log in to your account and go to 'My Orders'. You'll see real‑time status updates from the seller. Delivery times vary by seller.",
    },
    {
      icon: <Store className="h-5 w-5" />,
      question: "How do I become a seller on Niramoy?",
      answer:
        "Click 'Become a Seller' on the homepage, fill out your shop details, verify your email, and submit necessary documents. Once approved, you can list medicines, manage inventory, and update order statuses.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      question: "Are the medicines authentic?",
      answer:
        "Yes. All sellers are verified, and medicines come from licensed manufacturers. However, always consult a doctor before using any medication.",
    },
    {
      icon: <UserCheck className="h-5 w-5" />,
      question: "Do I need an account to buy?",
      answer:
        "Yes. You must register and verify your email to place orders. Registration is free and quick.",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      question: "I have an issue with my order. Who do I contact?",
      answer:
        "Contact support@niramoy.com or use the live chat (if available). Include your order number and details for faster resolution.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="mb-12 text-center md:mb-16">
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <HelpCircle className="mr-1 h-3.5 w-3.5" />
            Got Questions?
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Find answers to common questions about ordering, selling, payments,
            and more.
          </p>
        </div>

        {/* Quick Links / Highlight Card */}
        <Card className="mb-10 border-emerald-100 bg-emerald-50/30 shadow-sm">
          <CardContent className="p-4 text-center text-sm text-emerald-800 md:p-5">
            <p className="font-medium">📌 Quick reminder:</p>
            <p className="mt-1">
              Minimum order: <strong>৳100</strong> |
              <strong> No returns/refunds</strong> | Email verification required
            </p>
          </CardContent>
        </Card>

        {/* Accordion FAQ List */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-xl border border-gray-100 bg-white px-4 shadow-sm transition-all hover:shadow-md"
            >
              <AccordionTrigger className="py-4 text-left hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600">{faq.icon}</span>
                  <span className="text-base font-medium text-gray-900 sm:text-lg">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions? CTA */}
        <div className="mt-12 text-center md:mt-16">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-semibold text-gray-900">
              Still have questions?
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Can't find what you're looking for? Contact our support team.
            </p>
            <Button asChild variant="outline" className="mt-4 border-gray-300">
              <Link href="/contact">Contact Support →</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
