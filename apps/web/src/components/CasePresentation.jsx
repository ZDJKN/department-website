import React, { useId, useRef, useState } from "react";
import { Arrow, Label, pad, Photo } from "./ui.jsx";
import { Source } from "./work.jsx";
import "../case-presentation.css";

function OriginalPage({ image, label }) {
  return (
    <figure className="presentation-original">
      <div className="presentation-original-image">
        <Photo image={image} style={{ objectFit: "contain" }} />
      </div>
      <figcaption>
        <span>{label}</span>
        <a
          href={image.src}
          target="_blank"
          rel="noreferrer"
          aria-label="在新标签页中查看本页原图"
        >
          查看原图 <Arrow diagonal />
        </a>
      </figcaption>
    </figure>
  );
}

function ExecutionSummary({ item }) {
  return (
    <div className="presentation-execution">
      {item.services?.length > 0 && (
        <ol className="presentation-services">
          {item.services.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ol>
      )}
      {item.results?.length > 0 && (
        <dl className="presentation-results">
          {item.results.map(([value, label], index) => (
            <div key={index}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {!item.services?.length && !item.results?.length && (
        <p>项目执行资料正在整理。</p>
      )}
    </div>
  );
}

function BriefPage({ page, item, cover, gallery }) {
  return (
    <article className="presentation-sheet">
      <div className="presentation-sheet-heading">
        <span>{item.client}</span>
        <h3>{page.label}</h3>
      </div>
      {page.id === "overview" && (
        <div className="presentation-overview">
          <p>{item.background || item.summary}</p>
          {cover && <Photo image={cover} style={{ objectFit: "contain" }} />}
        </div>
      )}
      {page.id === "execution" && <ExecutionSummary item={item} />}
      {page.id === "gallery" && (
        <div className="presentation-gallery">
          {gallery.map((image) => (
            <figure key={image.src}>
              <Photo image={image} style={{ objectFit: "contain" }} />
              <figcaption>{image.caption || image.alt}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </article>
  );
}

function CasePresentation({ item }) {
  const headingId = useId();
  const panelId = useId();
  const navigation = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const slides = item.slides || [];
  const hasOriginal = slides.length > 0;
  const cover = item.cover || item.gallery?.[0];
  const seen = new Set([cover?.src]);
  const gallery = (item.gallery || []).filter((image) => {
    if (seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
  const pages = hasOriginal
    ? slides.map((image, index) => ({
        image,
        label: image.caption || `PPT 第 ${index + 1} 页`,
      }))
    : [
        { id: "overview", label: "项目概览" },
        {
          id: "execution",
          label: item.results?.length ? "执行与成果" : "执行内容",
        },
        ...(gallery.length ? [{ id: "gallery", label: "项目画面" }] : []),
      ];
  const index = Math.min(pageIndex, pages.length - 1);
  const page = pages[index];

  function changePage(next, moveFocus = false) {
    if (next < 0 || next >= pages.length || next === index) return;
    setPageIndex(next);
    const strip = navigation.current;
    const button = strip?.children[next];
    if (!button) return;
    if (moveFocus) button.focus({ preventScroll: true });
    const left = button.offsetLeft;
    const right = left + button.offsetWidth;
    if (left < strip.scrollLeft) strip.scrollLeft = left;
    else if (right > strip.scrollLeft + strip.clientWidth)
      strip.scrollLeft = right - strip.clientWidth;
  }

  function handleKeys(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    changePage(
      index + (event.key === "ArrowLeft" ? -1 : 1),
      navigation.current?.contains(event.target),
    );
  }

  return (
    <section
      className="wrap case-presentation"
      aria-labelledby={headingId}
      tabIndex={0}
      onKeyDown={handleKeys}
    >
      <div className="presentation-toolbar">
        <div>
          <Label>PROJECT PRESENTATION</Label>
          <h2 id={headingId}>{hasOriginal ? "项目PPT" : "项目简报"}</h2>
        </div>
        <div className="presentation-pager">
          <span
            className="presentation-page-count"
            role="status"
            aria-label={`第 ${index + 1} 页，共 ${pages.length} 页`}
          >
            {pad(index + 1)} <span>/</span> {pad(pages.length)}
          </span>
          {pages.length > 1 && (
            <>
              <button
                type="button"
                className="presentation-prev"
                aria-label="上一页"
                aria-disabled={index === 0}
                aria-controls={panelId}
                onClick={() => changePage(index - 1)}
              >
                <Arrow />
              </button>
              <button
                type="button"
                className="presentation-next"
                aria-label="下一页"
                aria-disabled={index === pages.length - 1}
                aria-controls={panelId}
                onClick={() => changePage(index + 1)}
              >
                <Arrow />
              </button>
            </>
          )}
        </div>
      </div>
      {pages.length > 1 && (
        <div
          className="presentation-navigation"
          ref={navigation}
          role="group"
          aria-label="选择演示页"
        >
          {pages.map((entry, i) => (
            <button
              type="button"
              key={i}
              aria-current={i === index ? "page" : undefined}
              aria-controls={panelId}
              onClick={() => changePage(i)}
            >
              <span aria-hidden="true">{pad(i + 1)}</span> {entry.label}
            </button>
          ))}
        </div>
      )}
      <div className="presentation-stage" id={panelId}>
        {hasOriginal ? (
          <OriginalPage image={page.image} label={page.label} />
        ) : (
          <BriefPage page={page} item={item} cover={cover} gallery={gallery} />
        )}
      </div>
      {hasOriginal && (
        <details className="presentation-transcript">
          <summary>查看文字版</summary>
          <div className="presentation-transcript-body">
            {item.summary && <p>{item.summary}</p>}
            {item.background && item.background !== item.summary && (
              <p>{item.background}</p>
            )}
            <h3>{item.results?.length ? "执行与成果" : "执行内容"}</h3>
            <ExecutionSummary item={item} />
          </div>
        </details>
      )}
      {(item.scope || item.source) && (
        <Source source={item.source} scope={item.scope} />
      )}
    </section>
  );
}

export { CasePresentation };
