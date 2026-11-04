import React from "react";
import { Arrow, href, Photo, Label, Title } from "../components/ui.jsx";
import { CaseCard } from "../components/work.jsx";
import { rootTeams } from "../../../../packages/contracts/organization.js";
import { TeamExplorer } from "../components/TeamExplorer.jsx";
import { Capabilities } from "../components/capabilities.jsx";
function Home({ data }) {
  const { site, cases, teams } = data;
  const featured = site.featuredIds
    .map((id) => cases.find((x) => x.id === id))
    .filter(Boolean);
  const heroPath = cases.some((c) => c.id === site.heroCaseId)
    ? "case/" + site.heroCaseId
    : "cases";
  return (
    <>
      <section className="hero-editorial wrap">
        <div className="studio-eyebrow" data-enter>
          <span>
            <i aria-hidden="true" /> CONTENT. PEOPLE. POSSIBILITIES.
          </span>
          <span>{site.eyebrow}</span>
        </div>
        <div className="hero-composition">
          <div className="hero-copy">
            <p className="hero-edition" data-enter>
              DIANSHI STUDIO — 创意与执行
            </p>
            <Title lines={site.title.split("\n")} />
            <p className="hero-description" data-enter>
              {site.description}
            </p>
            <div className="hero-actions" data-enter>
              <a className="solid-link" href={href("cases")}>
                探索我们的作品 <Arrow diagonal />
              </a>
              <a className="quiet-link" href={href("teams")}>
                认识这群人 <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-feature" data-enter>
            <div className="hero-frame-label">
              <span>IN THE MAKING</span>
              <span>01 / 现场</span>
            </div>
            <a
              className="hero-feature-link"
              href={href(heroPath)}
              aria-label={"查看" + site.heroCaption + "项目"}
            >
              <div className="hero-media">
                <Photo
                  image={site.heroImage}
                  loading="eager"
                  fetchPriority="high"
                  width={site.heroImage?.width || 1800}
                  height={site.heroImage?.height || 1200}
                />
              </div>
              <div className="hero-feature-caption">
                <div>
                  <small>{site.heroCaption}</small>
                  <p>创意，发生在现场。</p>
                </div>
                <Arrow diagonal />
              </div>
            </a>
          </div>
        </div>
        <div className="hero-colophon">
          <span>把想法做成作品，把内容带到人群中。</span>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              const section = document.getElementById("selected-work");
              section?.focus({ preventScroll: true });
              section?.scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              });
            }}
          >
            向下探索 <span aria-hidden="true">↓</span>
          </button>
        </div>
        <div className="brand-strip" aria-label="合作项目涉及的品牌">
          <span>
            与不同品牌
            <br />
            一起创造
          </span>
          <div>1688</div>
          <div>支付宝</div>
          <div>美团</div>
          <div>快手</div>
          <div>飞书</div>
          <div>小红书</div>
        </div>
      </section>
      <section
        id="selected-work"
        tabIndex={-1}
        className="work-section wrap section-space"
      >
        <div className="section-head" data-reveal>
          <div>
            <Label>01 / SELECTED WORK</Label>
            <h2>
              把想法，
              <br />
              做成看得见的作品<span className="blue">。</span>
            </h2>
          </div>
          <a className="pill-link" href={href("cases")}>
            全部项目<sup>{cases.length}</sup>
            <Arrow diagonal />
          </a>
        </div>
        <div className="work-grid">
          {featured.map((c, i) => (
            <CaseCard key={c.id} item={c} index={i} featured />
          ))}
        </div>
      </section>
      <section className="statement-section">
        <div className="wrap">
          <Label>02 / FROM STRATEGY TO EXECUTION</Label>
          <div className="statement-title" data-reveal>
            <h2>
              好想法，
              <br />
              也需要好功夫。
            </h2>
            <p>
              从理解问题开始，
              <br />
              让策略、内容和执行走到一起。
            </p>
          </div>
          <div className="statement-body">
            <div className="statement-note" data-reveal>
              <span aria-hidden="true">↘</span>
              <p>
                好内容的背后，是对业务的理解，也是把每一件小事做好的团队。我们从具体的问题出发，在执行中验证，在反馈中优化。
              </p>
              <a className="text-link" href={href("about")}>
                了解我们如何做事 <Arrow diagonal />
              </a>
            </div>
            <Capabilities />
          </div>
        </div>
      </section>
      <section className="people-section wrap section-space">
        <div className="section-head" data-reveal>
          <div>
            <Label>03 / THE PEOPLE</Label>
            <h2>
              好作品，
              <br />
              从好搭档开始<span className="blue">。</span>
            </h2>
          </div>
          <div className="section-aside">
            <p>
              不同的专长，同样的投入。
              <br />
              在每一个项目里，把彼此连接起来。
            </p>
            <a className="text-link" href={href("teams")}>
              认识我们的团队 <Arrow diagonal />
            </a>
          </div>
        </div>
        <TeamExplorer data={data} />
        <a className="team-ribbon" href={href("teams")}>
          <span>{rootTeams(teams).length} 个协作团队，一起把事情做好。</span>
          <Arrow diagonal />
        </a>
      </section>
      <ContactBanner site={site} />
    </>
  );
}
function ContactBanner({ site }) {
  return (
    <section className="contact-banner">
      <div className="wrap">
        <Label>04 / THE NEXT GOOD IDEA</Label>
        <a href={href("contact")}>
          <span>
            下一个好作品，
            <br />
            一起开始<span className="contact-dot">。</span>
          </span>
          <span className="contact-arrow">
            <Arrow diagonal />
          </span>
        </a>
        <div className="contact-banner-foot">
          <p>{site.contactText}</p>
          <span>LET’S MAKE IT HAPPEN</span>
        </div>
      </div>
    </section>
  );
}
export { Home, ContactBanner };
