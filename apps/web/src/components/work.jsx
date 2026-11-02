import React from "react";
import { Arrow, href, pad, Photo } from "./ui.jsx";
function CaseVisual({ item, hero = false }) {
  const imgs = item.cover
    ? [
        item.cover,
        ...(item.gallery || []).filter((im) => im.src !== item.cover.src),
      ]
    : item.gallery || [];
  const portrait = imgs[0] && imgs[0].width / imgs[0].height < 0.8;
  return (
    <div
      className={
        "case-visual " +
        (portrait ? "portrait" : "") +
        " " +
        (item.id === "case-4" ? "mascot" : "") +
        " " +
        (hero ? "detail-visual" : "")
      }
      style={{ "--case-color": item.accent || "#e7eaff" }}
    >
      <span className="visual-word" aria-hidden="true">
        {item.client}
      </span>
      <div className="visual-images">
        {(portrait ? imgs.slice(0, 3) : imgs.slice(0, 1)).map((im, i) => (
          <Photo
            key={im.src}
            image={im}
            style={{ objectFit: im.fit || "cover", "--i": i }}
          />
        ))}
      </div>
      <span className="visual-tag">{item.category}</span>
      <span className="visual-open">
        <Arrow diagonal />
      </span>
    </div>
  );
}

function CaseCard({ item, index, featured = false }) {
  return (
    <article
      className={"case-card " + (featured ? "featured-card" : "")}
      data-reveal
    >
      <a
        href={href("case/" + item.id)}
        className="case-link"
        aria-label={"查看" + item.client + "：" + item.name}
      >
        <CaseVisual item={item} />
        <div className="case-caption">
          <span className="case-index">{pad(index + 1)}</span>
          <div>
            <p className="case-client">{item.client}</p>
            <h3>{item.name}</h3>
          </div>
          <Arrow diagonal />
        </div>
      </a>
    </article>
  );
}

function Source({ source, scope }) {
  return (
    <aside className="source-note">
      <span>资料与口径</span>
      <p>{scope}</p>
      {source && (
        <small>
          来源：{source.title}
          {source.pages?.length
            ? " · 第 " + source.pages.join("、") + " 页"
            : ""}
        </small>
      )}
    </aside>
  );
}

export { CaseVisual, CaseCard, Source };
