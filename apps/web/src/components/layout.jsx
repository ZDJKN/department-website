import React, { useState, useEffect, useRef } from "react";
import { Arrow, href } from "./ui.jsx";
import { isStaticPreview } from "../api.js";
function Header({ route, site }) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 760px)").matches,
  );
  const menuButton = useRef(null);
  const navigation = useRef(null);
  const navigationFocusFrame = useRef(null);
  const section =
    { case: "cases", team: "teams", person: "teams" }[route.split("/")[0]] ||
    route.split("/")[0];
  useEffect(() => setOpen(false), [route]);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => {
      setMobile(query.matches);
      if (!query.matches) setOpen(false);
    };
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      cancelAnimationFrame(navigationFocusFrame.current);
    };
  }, []);
  useEffect(() => {
    if (!open || !mobile) return;
    const background = [
      ...document.querySelectorAll(
        "#root > main, #root > footer, #root > .skip-link, #root > .preview-banner",
      ),
    ].map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => (element.inert = true));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = () =>
      [
        ...(navigation.current?.querySelectorAll("a[href]") || []),
        menuButton.current,
      ].filter(Boolean);
    const frame = requestAnimationFrame(() => links()[0]?.focus());
    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButton.current?.focus();
      }
      if (event.key !== "Tab") return;
      const targets = links();
      const first = targets[0];
      const last = targets.at(-1);
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !targets.includes(active))) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (active === last || !targets.includes(active))
      ) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      background.forEach(({ element, inert }) => (element.inert = inert));
    };
  }, [open, mobile]);
  const navigate = (event) => {
    if (
      !mobile ||
      !open ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    setOpen(false);
    cancelAnimationFrame(navigationFocusFrame.current);
    navigationFocusFrame.current = requestAnimationFrame(() =>
      document.getElementById("main")?.focus({ preventScroll: true }),
    );
  };
  return (
    <header className="header">
      <a
        className="brand"
        href={href()}
        aria-label={site.name + " 首页"}
        tabIndex={mobile && open ? -1 : undefined}
      >
        <span className="brand-icon">
          <i />
          <i />
          <i />
        </span>
        <span>
          {site.name}
          <small>DIANSHI STUDIO</small>
        </span>
      </a>
      <nav
        ref={navigation}
        id="primary-navigation"
        className={open ? "open" : ""}
        aria-label="主导航"
        aria-hidden={mobile && !open ? true : undefined}
        inert={mobile && !open}
      >
        {[
          ["", "首页"],
          ["cases", "项目案例"],
          ["teams", "我们的团队"],
          ["about", "关于我们"],
        ].map(([p, t], index) => (
          <a
            href={href(p)}
            aria-current={section === p ? "page" : undefined}
            onClick={navigate}
            key={p}
          >
            <span className="nav-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="nav-label">{t}</span>
          </a>
        ))}
        <a
          className="nav-contact"
          href={href("contact")}
          aria-current={section === "contact" ? "page" : undefined}
          onClick={navigate}
        >
          聊聊合作
          <Arrow diagonal />
        </a>
      </nav>
      <button
        ref={menuButton}
        type="button"
        className="menu-toggle"
        aria-controls="primary-navigation"
        aria-expanded={open}
        aria-label={open ? "关闭菜单" : "打开菜单"}
        onClick={() => setOpen(!open)}
      >
        {open ? "关闭" : "菜单"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
    </header>
  );
}

function Footer({ site }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <a className="footer-signature" href={href()}>
          {site.name}
          <span>DIANSHI STUDIO</span>
        </a>
        <p className="footer-note">{site.eyebrow}</p>
        <a className="footer-contact" href={href("contact")}>
          聊聊合作
          <Arrow diagonal />
        </a>
      </div>
      <div className="footer-wordmark" aria-hidden="true" translate="no">
        DIANSHI
      </div>
      <div className="footer-bottom">
        <span>CONTENT. PEOPLE. POSSIBILITIES.</span>
        {!isStaticPreview && <a href="/admin/">内容管理 ↗</a>}
        <span>© {new Date().getFullYear()} DIANSHI</span>
      </div>
    </footer>
  );
}

export { Header, Footer };
