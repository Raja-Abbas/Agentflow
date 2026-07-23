import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const ibmPlex = IBM_Plex_Mono({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AgentFlow — Build AI Chatbots Visually",
  description:
    "Build, test, and deploy AI chatbots with a visual drag-and-drop flow editor. Connect to OpenAI, Gemini, and Claude. No coding required.",
  keywords: [
    "ai chatbot",
    "chatbot builder",
    "ai agent",
    "no-code",
    "visual flow editor",
    "openai",
    "drag and drop",
  ],
  openGraph: {
    title: "AgentFlow — Build AI Chatbots Visually",
    description:
      "Build, test, and deploy AI chatbots with a visual drag-and-drop flow editor.",
    images: ["/og-image.svg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${ibmPlex.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
