import "./globals.css";

interface Metadata {
  title?: string;
  description?: string;
  openGraph?: Record<string, any>;
  [key: string]: any;
}

export const metadata: Metadata = {
  title: "EcBiz Study — CIE Cambridge 0264 Business & Economics",
  description:
    "Zero-cost, CIE Cambridge-aligned Business & Economics practice platform featuring 0264 syllabus glossary, verified question bank, two-pass blueprint generator, and instant AO1-AO4 assessment engine.",
  openGraph: {
    title: "EcBiz Study — CIE Cambridge 0264 Business & Economics",
    description:
      "Zero-cost, CIE Cambridge-aligned Business & Economics practice platform featuring 0264 syllabus glossary, verified question bank, two-pass blueprint generator, and instant AO1-AO4 assessment engine.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-[#1C1917] selection:bg-[#E2E8F0] selection:text-[#0F172A]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
