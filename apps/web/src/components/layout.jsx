import React, { useState, useEffect } from "react";
import { Arrow, href } from "./ui.jsx";
import { isStaticPreview } from "../api.js";
function Header({ route, site }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [route]);
  return (
    <header className="header">
      <a className="brand" href={href()} aria-label="点石成金 首页">
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
      <nav className={open ? "open" : ""} aria-label="主导航">
        {[
          ["", "首页"],
          ["cases", "项目案例"],
          ["teams", "我们的团队"],
          ["about", "关于我们"],
        ].map(([p, t]) => (
          <a
            href={href(p)}
            aria-current={route.split("/")[0] === p ? "page" : undefined}
            key={p}
          >
            {t}
            <span>↗</span>
          </a>
        ))}
        <a className="nav-contact" href={href("contact")}>
          聊聊合作
          <Arrow diagonal />
        </a>
      </nav>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-label={open ? "关闭菜单" : "打开菜单"}
        onClick={() => setOpen(!open)}
      >
        {open ? "关闭" : "菜单"}
        <span>{open ? "−" : "+"}</span>
      </button>
    </header>
  );
}

function Footer({ site }) {
  return (
    <footer>
      <div className="footer-top">
        <p>好想法，值得一起实现。</p>
        <a href={href("contact")}>
          LET’S MAKE IT HAPPEN
          <Arrow diagonal />
        </a>
      </div>
      <div className="footer-bottom">
        <span>
          {site.eyebrow} · {site.name}
        </span>
        <span>CONTENT. PEOPLE. POSSIBILITIES.</span>
        {!isStaticPreview && <a href="/admin/">内容管理 ↗</a>}
        <span>© {new Date().getFullYear()} DIANSHI</span>
      </div>
    </footer>
  );
}

export { Header, Footer };
