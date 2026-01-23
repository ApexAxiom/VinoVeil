import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Root layout with header/footer. */
export function RootLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-night text-parchment">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-wine/30 blur-[140px]" />
        <div className="absolute right-0 top-0 h-[32rem] w-[32rem] rounded-full border border-gold/20 opacity-60 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-24 pt-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
