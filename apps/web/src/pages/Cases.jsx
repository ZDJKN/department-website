import React, { useState, useMemo, useEffect } from "react";
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
import {
  createCaseIndex,
  findCases,
  readCaseFilters,
  caseFilterHash,
} from "../lib/case-discovery.js";
import {
  rootTeams,
  teamPath,
} from "../../../../packages/contracts/organization.js";
import "../case-discovery.css";

function Cases({ data, hash }) {
  const [filters, setFilters] = useState(() =>
    readCaseFilters(location.hash, data),
  );
  const [copyStatus, setCopyStatus] = useState("");
  const index = useMemo(() => createCaseIndex(data), [data]);
  useEffect(() => {
    setFilters(readCaseFilters(hash, data));
    setCopyStatus("");
  }, [hash, data]);
  const list = findCases(index, filters);
  const categories = [...new Set(data.cases.map((c) => c.category))];
  const active = filters.q || filters.team || filters.category;
  function update(next) {
    const value = { ...filters, ...next };
    setFilters(value);
    setCopyStatus("");
    history.replaceState(
      history.state,
      "",
      location.pathname + location.search + caseFilterHash(value),
    );
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
  async function copyLink() {
    const url = new URL(location.href);
    url.hash = caseFilterHash(filters);
    try {
      await navigator.clipboard.writeText(url.href);
      setCopyStatus("链接已复制，可直接分享当前筛选。");
    } catch {
      setCopyStatus("请复制浏览器地址栏中的链接分享。");
    }
  }
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
      <div className="case-discovery" role="search" aria-label="查找项目案例">
        <div className="case-search-row">
          <label className="case-query">
            <span>找一个合适的案例</span>
            <div>
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
              <input
                name="case-search"
                type="search"
                autoComplete="off"
                maxLength={200}
                value={filters.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="品牌、内容关键词或成员姓名…"
              />
            </div>
          </label>
          <label className="case-team-filter">
            <span>按团队与小组查找</span>
            <select
              name="case-team"
              value={filters.team}
              onChange={(e) => update({ team: e.target.value })}
            >
              <option value="">全部团队</option>
              {rootTeams(data.teams).map((team) => (
                <optgroup label={team.name} key={team.id}>
                  <option value={team.id}>{team.name} · 全部</option>
                  {data.teams
                    .filter(
                      (group) =>
                        group.id !== team.id &&
                        teamPath(data.teams, group.id).some(
                          (t) => t.id === team.id,
                        ),
                    )
                    .map((group) => (
                      <option key={group.id} value={group.id}>
                        {teamPath(data.teams, group.id)
                          .slice(1)
                          .map((t) => t.name)
                          .join(" / ")}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
        </div>
        <div className="case-keywords" aria-label="常用内容关键词">
          <span>试试找</span>
          {["海报", "故事", "短视频", "直播", "数字人"].map((q) => (
            <button
              key={q}
              aria-pressed={filters.q === q}
              onClick={() => update({ q })}
            >
              {q}
              <Arrow diagonal />
            </button>
          ))}
        </div>
        <div className="filter-tabs case-category-tabs" aria-label="案例分类">
          {["", ...categories].map((category) => (
            <button
              key={category}
              aria-pressed={filters.category === category}
              className={filters.category === category ? "selected" : ""}
              onClick={() => update({ category })}
            >
              {category || "全部项目"}
            </button>
          ))}
        </div>
      </div>
      <div className="case-results-head">
        <p className="result-count" role="status">
          找到 <strong>{pad(list.length)}</strong> / {data.cases.length} 个项目
        </p>
        <div>
          {active && (
            <button
              className="case-reset"
              onClick={() => update({ q: "", category: "", team: "" })}
            >
              清除筛选
            </button>
          )}
          <button className="case-share" onClick={copyLink}>
            复制筛选链接 <Arrow diagonal />
          </button>
        </div>
      </div>
      <p className="case-copy-status" role="status">
        {copyStatus}
      </p>
      <div className="case-library">
        {list.map((c, i) => (
          <CaseCard key={c.id} item={c} index={i} reveal={false} />
        ))}
      </div>
      {!list.length && (
        <div className="empty case-empty">
          <Label>KEEP EXPLORING</Label>
          <h2>暂时没有匹配的公开案例</h2>
          <p>
            试试更短的关键词，或清除团队与分类限制。尚未收录的作品会在资料补齐后更新。
          </p>
          <button onClick={() => update({ q: "", category: "", team: "" })}>
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
