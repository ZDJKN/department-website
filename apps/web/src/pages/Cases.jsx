import React, { useState } from "react";
import {
  Arrow,
  href,
  pad,
  Photo,
  Label,
  Title,
  NotFound,
} from "../components/ui.jsx";
import { CaseCard, CaseVisual, Source } from "../components/work.jsx";
function Cases({ data }) {
  const [category, setCategory] = useState("全部项目"),
    [q, setQ] = useState("");
  const cats = ["全部项目", ...new Set(data.cases.map((c) => c.category))];
  const list = data.cases.filter(
    (c) =>
      (category === "全部项目" || c.category === category) &&
      [c.client, c.name, c.summary]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <section className="wrap page-main">
      <div className="page-heading">
        <Label>OUR WORK / 项目案例</Label>
        <div className="page-heading-row">
          <Title lines={["把想法，", "做成看得见的作品。"]} />
          <p data-enter>
            从内容到现场，
            <br />
            每一个项目都是一次共同创造。
          </p>
        </div>
      </div>
      <div className="work-tools" data-enter>
        <div className="filter-tabs" aria-label="案例分类">
          {cats.map((c) => (
            <button
              aria-pressed={category === c}
              className={category === c ? "selected" : ""}
              key={c}
              onClick={() => setCategory(c)}
            >
              {c}
              {c === category && <sup>{list.length}</sup>}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">搜索项目</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索品牌 / 项目"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="6" />
            <path d="m15 15 6 6" />
          </svg>
        </label>
      </div>
      <p className="result-count" aria-live="polite">
        {pad(list.length)} 个项目
      </p>
      <div className="case-library">
        {list.map((c, i) => (
          <CaseCard key={c.id} item={c} index={i} />
        ))}
      </div>
      {!list.length && (
        <div className="empty">
          <h2>暂时没有匹配的项目</h2>
          <button
            onClick={() => {
              setQ("");
              setCategory("全部项目");
            }}
          >
            查看全部项目 ↗
          </button>
        </div>
      )}
    </section>
  );
}

function CaseDetail({ data, id }) {
  const c = data.cases.find((c) => c.id === id);
  if (!c) return <NotFound />;
  const team = data.teams.find((t) => t.id === c.teamId);
  const next = data.cases[(data.cases.indexOf(c) + 1) % data.cases.length];
  return (
    <>
      <section className="wrap detail-head">
        <a className="back-link" href={href("cases")}>
          ← 全部项目
        </a>
        <div className="detail-meta">
          <Label>{c.category}</Label>
          <span>{c.year || "项目记录"}</span>
        </div>
        <Title lines={[c.client, c.name]} />
        <p className="detail-summary" data-enter>
          {c.summary}
        </p>
      </section>
      <section className="wrap" data-enter>
        <CaseVisual item={c} hero />
      </section>
      <section className="wrap case-story">
        <div className="story-side">
          <span className="small-label">PROJECT OVERVIEW</span>
          <h2>
            从问题出发，
            <br />
            把事情做好。
          </h2>
          {team && (
            <a href={href("team/" + team.id)}>
              {team.name}
              <Arrow diagonal />
            </a>
          )}
        </div>
        <div className="story-content">
          <div data-reveal>
            <Label>01 / 项目背景</Label>
            <p className="story-lead">{c.background}</p>
          </div>
          <div className="story-actions" data-reveal>
            <Label>02 / 我们做了什么</Label>
            {c.services.map((s, i) => (
              <div className="action-item" key={i}>
                <span>{pad(i + 1)}</span>
                <p>{s}</p>
              </div>
            ))}
          </div>
          {c.results?.length > 0 && (
            <div data-reveal>
              <Label>03 / 项目表现</Label>
              <div className="result-grid">
                {c.results.map(([value, label]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Source source={c.source} scope={c.scope} />
        </div>
      </section>
      {c.gallery?.filter((im) => im.src !== c.cover?.src).length > 0 && (
        <section className="wrap project-gallery">
          <Label>PROJECT GALLERY / 项目画面</Label>
          <div className="gallery-grid">
            {c.gallery
              .filter((im) => im.src !== c.cover?.src)
              .map((image, i) => (
                <figure key={image.src} data-reveal>
                  <div>
                    <Photo
                      image={image}
                      style={{ objectFit: image.fit || "contain" }}
                    />
                  </div>
                  <figcaption>
                    {image.caption || image.alt}
                    <span>{pad(i + 1)}</span>
                  </figcaption>
                </figure>
              ))}
          </div>
        </section>
      )}
      <section className="next-project">
        <a className="wrap" href={href("case/" + next.id)}>
          <span>
            下一个项目<small>NEXT PROJECT</small>
          </span>
          <h2>{next.client}</h2>
          <Arrow diagonal />
        </a>
      </section>
    </>
  );
}

export { Cases, CaseDetail };
