import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function usePageMotion(key, ready) {
  useLayoutEffect(() => {
    if (!ready) return;
    const match = gsap.matchMedia();
    match.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-title] .title-line > span", {
          yPercent: 110,
          rotate: 2,
          duration: 1.05,
          stagger: 0.12,
          ease: "power4.out",
          clearProps: "transform",
        });
        gsap.from("[data-enter]", {
          y: 22,
          opacity: 0,
          duration: 0.85,
          delay: 0.15,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all",
        });
        gsap.utils.toArray("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 42,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 95%", once: true },
            clearProps: "all",
          }),
        );
        if (window.innerWidth > 760)
          gsap.utils.toArray("[data-parallax]").forEach((el) =>
            gsap.fromTo(
              el,
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: "none",
                scrollTrigger: {
                  trigger: el.parentElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            ),
          );
      });
      return () => ctx.revert();
    });
    return () => match.revert();
  }, [key, ready]);
}

export function refreshPageMotion() {
  ScrollTrigger.refresh();
}
