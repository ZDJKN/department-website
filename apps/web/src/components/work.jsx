import React from "react";
import { Arrow, href, pad, Photo } from "./ui.jsx";
function CaseVisual({ item, hero = false, editorial = false }) {
  const alternate =
    editorial && item.cover?.fit === "cover"
      ? item.gallery?.find(
          (image) =>
            image.src !== item.cover.src &&
            image.width >= 1000 &&
            image.fit === "cover",
        )
      : null;
  const cover = alternate || item.cover;
  const imgs = cover
    ? [cover, ...(item.gallery || []).filter((im) => im.src !== cover.src)]
    : item.gallery || [];
  const portrait =
    !alternate && imgs[0] && imgs[0].width / imgs[0].height < 0.8;
  const compact = imgs[0]?.width < 700 && !portrait;
  return (
    <div
      className={
        "case-visual " +
        (portrait ? "portrait" : "") +
        " " +
        (item.id === "case-4" ? "mascot" : "") +
        (compact ? " compact-media" : "") +
        (imgs[0]?.fit === "contain"
          ? " artwork-media"
          : " photographic-media") +
        " " +
        (hero ? "detail-visual" : "")
      }
      style={{
        "--case-color": item.accent || "#e7eaff",
        "--source-width": (imgs[0]?.width || 1800) + "px",
      }}
    >
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

function CaseCard({
  item,
  index,
  featured = false,
  reveal = true,
  useSlideCover = false,
}) {
  const slideCover = item.slides?.[0] || item.cover;
  return (
    <article
      className={"case-card " + (featured ? "featured-card" : "")}
      data-reveal={reveal ? "" : undefined}
    >
      <a
        href={href("case/" + item.id)}
        className="case-link"
        aria-label={"查看" + item.client + "：" + item.name}
      >
        {useSlideCover ? (
          <div className="case-deck-cover">
            {slideCover ? (
              <Photo
                image={slideCover}
                style={{ objectFit: "contain" }}
                loading={index < 3 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
              />
            ) : (
              <span>封面资料待补</span>
            )}
          </div>
        ) : (
          <CaseVisual item={item} editorial={featured && index === 0} />
        )}
        <div className="case-caption">
          <div className="case-caption-main">
            <div className="case-byline">
              <p className="case-client">{item.client}</p>
              <span>{item.category}</span>
            </div>
            <h3>{item.name}</h3>
          </div>
          <span className="case-index">{pad(index + 1)}</span>
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
