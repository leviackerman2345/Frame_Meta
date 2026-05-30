"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { LoginModal } from "@/components/ui/LoginModal";

const HIDDEN_ROUTES = ["/login"];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  return (
    <>
      {!isFullscreen && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}
      {children}
      {!isFullscreen && <Footer />}
      <LoginModal />
    </>
  );
}
