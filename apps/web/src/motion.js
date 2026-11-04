import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function usePageMotion(key, ready) {
  useLayoutEffect(() => {
    if (!ready) return;
    const scope = document.getElementById("main");
    if (!scope) return;
    const select = gsap.utils.selector(scope);
    const match = gsap.matchMedia();
    match.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(select("[data-title] .title-line > span"), {
        yPercent: 105,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      });
      gsap.from(select("[data-enter]"), {
        y: 16,
        opacity: 0,
        duration: 0.65,
        stagger: 0.055,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
      select("[data-reveal]").forEach((el) =>
        gsap.from(el, {
          y: 22,
          opacity: 0,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 96%",
            once: true,
            invalidateOnRefresh: true,
          },
          clearProps: "transform,opacity",
        }),
      );
    });
    match.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 1024px)",
      },
      ({ conditions }) => {
        if (!conditions.motion || !conditions.desktop) return;
        select("[data-parallax]").forEach((el) =>
          gsap.fromTo(
            el,
            { yPercent: -2, scale: 1.05 },
            {
              yPercent: 2,
              scale: 1.05,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            },
          ),
        );
      },
    );

    let frame;
    let disposed = false;
    const queueRefresh = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(refreshPageMotion);
    };
    const resize = new ResizeObserver(queueRefresh);
    resize.observe(scope);
    scope.addEventListener("load", queueRefresh, true);
    scope.addEventListener("error", queueRefresh, true);
    scope.addEventListener("toggle", queueRefresh, true);
    window.addEventListener("resize", queueRefresh, { passive: true });
    document.fonts?.ready.then(() => {
      if (!disposed) queueRefresh();
    });
    queueRefresh();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      scope.removeEventListener("load", queueRefresh, true);
      scope.removeEventListener("error", queueRefresh, true);
      scope.removeEventListener("toggle", queueRefresh, true);
      window.removeEventListener("resize", queueRefresh);
      match.revert();
    };
  }, [key, ready]);
}

export function refreshPageMotion() {
  ScrollTrigger.refresh();
}
