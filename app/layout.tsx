import type { Metadata, Viewport } from "next";
import { Montserrat, Quattrocento } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/content";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const quattrocento = Quattrocento({ subsets: ["latin"], weight: "400", variable: "--font-quattrocento", display: "swap" });

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} ${quattrocento.variable}`}>
      <body>
        {gtmId ? (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
          </noscript>
        ) : null}
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
