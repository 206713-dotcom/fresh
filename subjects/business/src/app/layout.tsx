import "./globals.css";

interface Metadata {
  title?: string;
  description?: string;
  openGraph?: Record<string, any>;
  [key: string]: any;
}

export const metadata: Metadata = {
  title: "EcBiz",
  description:
    "EcBiz platform featuring Sections 1-6 Topical Practice, 100-Case Paper 2 Simulator with Appendices 1-3, and local in-browser Qwen 3.5 0.8B level assessment engine.",
  openGraph: {
    title: "EcBiz",
    description:
      "EcBiz platform featuring Sections 1-6 Topical Practice, 100-Case Paper 2 Simulator with Appendices 1-3, and local in-browser Qwen 3.5 0.8B level assessment engine.",
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
