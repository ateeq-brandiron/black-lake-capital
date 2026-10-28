import type { Metadata, Viewport } from "next";
import { Lato, Montserrat, Quattrocento, Questrial } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import { site } from "@/lib/content";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const quattrocento = Quattrocento({ subsets: ["latin"], weight: "400", variable: "--font-quattrocento", display: "swap" });
// Lato: Investments cards on the live site. Questrial: free fallback for Century Gothic (testimonials).
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: "swap" });
const questrial = Questrial({ subsets: ["latin"], weight: "400", variable: "--font-questrial", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
const indexable = process.env.VERCEL_ENV === "production";
// Tag Manager container from the live site. Loads only on production so staging traffic stays out of analytics.
const gtmId = indexable ? (process.env.NEXT_PUBLIC_GTM_ID ?? site.tracking.gtmId) : null;
const siteVerification = process.env.GOOGLE_SITE_VERIFICATION ?? site.tracking.googleSiteVerification;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.messaging.elevatorPitch,
  robots: indexable ? undefined : { index: false, follow: false },
  verification: siteVerification ? { google: siteVerification } : undefined,
};

export const viewport: Viewport = { themeColor: "#2e3b54" };

// Organization details for search engines (logo, contact, LinkedIn profile).
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: siteUrl,
  logo: new URL("/images/brand/lake-mark.svg", siteUrl).href,
  email: site.contact.email,
  telephone: site.contact.phoneHref.replace("tel:", ""),
  address: { "@type": "PostalAddress", streetAddress: site.contact.address[0], addressLocality: "Evergreen", addressRegion: "CO", postalCode: "80439", addressCountry: "US" },
  sameAs: site.contact.linkedin.href ? [site.contact.linkedin.href] : [],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} ${quattrocento.variable} ${lato.variable} ${questrial.variable}`}>
      <body>
        {gtmId ? (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
          </noscript>
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
        <ScrollToTop />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {gtmId ? (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
