import React from "react";
const Arrow = ({ diagonal = false, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    {...props}
  >
    <path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M3 12h17M13 5l7 7-7 7"} />
  </svg>
);

const Star = () => (
  <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
    <path d="m50 0 8 32 24-21-14 30 32 9-32 9 14 30-24-21-8 32-8-32-24 21 14-30L0 50l32-9-14-30 24 21Z" />
  </svg>
);

const href = (path = "") => "#/" + path;

const pad = (n) => String(n).padStart(2, "0");

function Photo({ image, style, ...props }) {
  return image ? (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading="lazy"
      decoding="async"
      style={{ objectFit: image.fit || "cover", ...style }}
      {...props}
    />
  ) : null;
}

function Label({ children, number }) {
  return (
    <div className="section-label">
      <span className="dot" />
      {children}
      {number && <span className="label-no">{number}</span>}
    </div>
  );
}

function Title({ lines }) {
  return (
    <h1 data-title>
      {lines.map((line, i) => (
        <span className="title-line" key={i}>
          <span>{line}</span>
        </span>
      ))}
    </h1>
  );
}

function NotFound() {
  return (
    <section className="wrap empty page-main">
      <Label>404</Label>
      <h1>这一页，暂时没有故事。</h1>
      <a className="pill-link" href={href()}>
        回到首页
        <Arrow />
      </a>
    </section>
  );
}

export { Arrow, Star, href, pad, Photo, Label, Title, NotFound };
