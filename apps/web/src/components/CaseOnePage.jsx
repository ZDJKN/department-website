import React from "react";
import { Arrow, Photo, pad } from "./ui.jsx";
import "../case-one-page.css";

const signals = {
  矩阵获客: "amber",
  品牌官号: "cyan",
  小红书矩阵: "coral",
  直播业务: "amber",
  直播电商: "cyan",
  线下与直播: "violet",
  社群运营: "lime",
};

function CaseOnePage({ item, team, thumbnail = false }) {
  const visual = item.cover || item.gallery?.[0];
  const evidence = item.gallery?.find(
    (image) => image.src !== visual?.src && image.width / image.height >= 2.4,
  );
  const results = item.results || [];
  const services = item.services || [];
  const signal = signals[item.category] || "cyan";
  const number = pad(item.order + 1);
  return (
    <div className={thumbnail ? "case-sheet-thumb" : "wrap case-sheet-page"}>
      {!thumbnail && (
        <div className="case-sheet-tools">
          <p>
            项目演示 <span>01 / 01</span>
          </p>
          <button type="button" onClick={() => window.print()}>
            打印或保存 PDF <Arrow diagonal />
          </button>
        </div>
      )}
      <article
        className="case-sheet"
        data-signal={signal}
        aria-label={thumbnail ? undefined : item.client + "项目演示"}
        aria-hidden={thumbnail || undefined}
      >
        <header className="case-sheet-mast">
          <span className="case-sheet-series">
            <i aria-hidden="true" /> 点石成金
            <span>CASE {number}</span>
          </span>
          <span className="case-sheet-category">{item.category}</span>
        </header>
        <div className="case-sheet-main">
          <div className="case-sheet-brief">
            <span className="case-sheet-client">{item.client}</span>
            <h2>{item.name}</h2>
          </div>
          <figure
            className="case-sheet-visual"
            data-evidence={evidence ? "" : undefined}
          >
            {visual ? (
              <Photo
                image={visual}
                className="case-sheet-art"
                alt={thumbnail ? "" : visual.alt}
                loading={thumbnail ? "lazy" : "eager"}
                style={{ objectFit: "contain" }}
              />
            ) : (
              <span>{item.client}</span>
            )}
            {evidence && (
              <Photo
                image={evidence}
                className="case-sheet-evidence"
                alt={thumbnail ? "" : evidence.alt}
                style={{ objectFit: "contain" }}
              />
            )}
            {visual && (
              <figcaption>
                {evidence ? "项目作品" : visual.caption || "项目画面"}
              </figcaption>
            )}
          </figure>
        </div>
        {results.length > 0 && (
          <section className="case-sheet-results" aria-label="项目成果">
            <h3>项目成果</h3>
            <dl>
              {results.map(([value, label], index) => (
                <div
                  key={index}
                  className={index === 0 ? "is-primary" : undefined}
                >
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        {!thumbnail && (
          <div className="case-sheet-details">
            <section className="case-sheet-context" aria-label="项目背景">
              <h3>项目背景</h3>
              <p className="case-sheet-summary">{item.summary}</p>
              {item.background && <p>{item.background}</p>}
            </section>
            {services.length > 0 && (
              <section className="case-sheet-work" aria-label="项目执行">
                <h3>项目执行</h3>
                <ol>
                  {services.map((service, index) => (
                    <li key={index}>
                      <span aria-hidden="true">{pad(index + 1)}</span>
                      {service}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        )}
        <footer className="case-sheet-foot">
          <span>{team?.name || "运营四部"}</span>
          {!thumbnail && item.scope && <p>{item.scope}</p>}
          <span>01 / 01</span>
        </footer>
      </article>
    </div>
  );
}

export { CaseOnePage };
