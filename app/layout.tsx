import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "Gateway Garden Center Workspace",
  description: "Internal planning, approvals, scheduling, and documentation workspace."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
