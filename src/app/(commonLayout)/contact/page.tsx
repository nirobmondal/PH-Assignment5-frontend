// app/contact/page.tsx
"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call – replace with your actual contact endpoint
    // this api is not implemented, so we just wait for 1 second and show a success message
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Us",
      details: "support@niramoy.com",
      sub: "For general inquiries & support",
      href: "mailto:support@niramoy.com",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Call Us",
      details: "+880 1234 567890",
      sub: "Mon-Sat, 9AM - 6PM",
      href: "tel:+8801234567890",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Visit Us",
      details: "Dhaka, Bangladesh",
      sub: "House 123, Road 45, Gulshan",
      href: "#",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <MessageCircle className="mr-1 h-3.5 w-3.5" />
            Get in Touch
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
            Have a question, feedback, or need assistance? We'd love to hear
            from you. Fill out the form or reach out directly.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contactMethods.map((method, idx) => (
            <Card
              key={idx}
              className="border-gray-100 shadow-sm transition-all hover:shadow-md"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {method.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{method.details}</p>
                <p className="text-xs text-gray-500">{method.sub}</p>
                <Button
                  asChild
                  variant="link"
                  className="mt-3 h-auto p-0 text-emerald-600"
                >
                  <a href={method.href}>Contact →</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form + Map/Info Row */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="border-gray-100 shadow-md">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Order issue, seller question, etc."
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-center text-xs text-gray-500">
                  By submitting, you agree to our privacy policy.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Right side: Operating hours + location note */}
          <div className="space-y-6">
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Operating Hours
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Monday – Friday: 9:00 AM – 6:00 PM (BST)
                    </p>
                    <p className="text-sm text-gray-600">
                      Saturday: 10:00 AM – 4:00 PM
                    </p>
                    <p className="text-sm text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Our Office</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Niramoy Headquarters
                      <br />
                      House 123, Road 45, Gulshan-2
                      <br />
                      Dhaka 1212, Bangladesh
                    </p>
                  </div>
                </div>
                {/* Simple map placeholder - replace with actual embed if needed */}
                <div className="mt-4 h-40 w-full overflow-hidden rounded-lg bg-gray-100">
                  <iframe
                    title="Office Location"
                    className="h-full w-full grayscale"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.8375!2d90.4124!3d23.8103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c8c8c8c8c8c9%3A0x0!2zR3Vsc2hhbiwgRGhha2E!5e0!3m2!1sen!2sbd!4v1650000000000!5m2!1sen!2sbd"
                    loading="lazy"
                  ></iframe>
                </div>
              </CardContent>
            </Card>

            {/* Extra note: Response time */}
            <div className="rounded-lg bg-emerald-50 p-4 text-center text-sm text-emerald-800">
              <p>📬 We typically respond within 24 hours on business days.</p>
              <p className="mt-1 text-xs">
                Urgent issues? Please call our support line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
