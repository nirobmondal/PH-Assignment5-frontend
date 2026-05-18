import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse medicines", href: "/medicine" },
      { label: "Create account", href: "/register" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Niramoy", href: "/about" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Delivery info", href: "/delivery" },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="mt-auto bg-black text-[#d9f0f0]">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2.2fr]">
          {/* Logo & description – already centered on mobile */}
          <div className="space-y-5 text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Niramoy logo"
                width={32}
                height={32}
                className="h-8 w-8 md:h-10 md:w-10"
              />
              <span className="text-xl font-semibold tracking-tight md:text-2xl">
                Niramoy
              </span>
            </Link>
            <p className="text-sm leading-7 text-[#d9f0f0]/80 md:text-base">
              A multi-vendor medicine platform connecting verified sellers and
              customers with transparent stock, pricing, and delivery updates.
            </p>
          </div>

          {/* Links grid – centered on mobile, left-aligned on tablet+ */}
          <div className="grid gap-6 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-3 sm:gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9f0f0] sm:text-sm">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-xs text-[#d9f0f0]/75 sm:text-sm">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6 bg-[#0b4f5b]/50 md:my-8" />

        <div className="flex text-xs text-[#d9f0f0]/70 items-center justify-center">
          <p className="text-center">
            © {new Date().getFullYear()} Niramoy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
