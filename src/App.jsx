import { useEffect } from "react";
import { StoreProvider } from "./context/StoreContext.jsx";
import { Sprite } from "./components/Icon.jsx";
import { Ticker, Nav, MobileMenu } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { Problem, HowItWorks, Anatomy, Features } from "./components/Sections.jsx";
import { Colorways } from "./components/Colorways.jsx";
import { Timeline, Safety, Faq, FinalCta, Footer } from "./components/Story.jsx";
import { Shop } from "./components/Shop.jsx";
import { CartDrawer } from "./components/CartDrawer.jsx";
import { SafetyDialog, Toast } from "./components/Overlays.jsx";

function Site() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("[data-reveal]"));

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nav = document.querySelector(".nav");
    const progress = document.getElementById("scrollProgress");
    let frame = 0;

    const update = () => {
      frame = 0;
      const top = window.scrollY || document.documentElement.scrollTop;
      if (nav) nav.classList.toggle("is-stuck", top > 12);
      if (progress) {
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${height > 0 ? Math.min(100, (top / height) * 100) : 0}%`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <Sprite />
      <div className="scroll-progress" aria-hidden="true">
        <span id="scrollProgress" />
      </div>
      <div className="grain" aria-hidden="true" />
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Ticker />
      <Nav />
      <MobileMenu />

      <main id="main">
        <Hero />
        <Problem />
        <HowItWorks />
        <Anatomy />
        <Features />
        <Colorways />
        <Timeline />
        <Safety />
        <Shop />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
      <CartDrawer />
      <SafetyDialog />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Site />
    </StoreProvider>
  );
}
