import Link from "next/link";
import { footerCompanyLinks, footerLegalLinks } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-white/5 w-full py-xl px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-xl">
      <div className="col-span-1 md:col-span-2 flex flex-col gap-sm">
        <span className="text-headline-md font-headline-md font-bold text-on-surface">
          NEXONIC
        </span>
        <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
          © {new Date().getFullYear()} NEXONIC Animation Studio. All rights reserved.
        </p>
      </div>

      <div className="col-span-1 flex flex-col gap-sm">
        <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-xs">
          Legal
        </h3>
        {footerLegalLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="col-span-1 flex flex-col gap-sm">
        <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-xs">
          Company
        </h3>
        {footerCompanyLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
