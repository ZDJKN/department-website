import React from "react";
import { Arrow, Star, href, Photo, Label, Title } from "../components/ui.jsx";
import { CaseCard } from "../components/work.jsx";
import { rootTeams } from "../../../../packages/contracts/organization.js";
import { TeamExplorer } from "../components/TeamExplorer.jsx";
import { Capabilities } from "../components/capabilities.jsx";
function Home({ data }) {
  const { site, cases, teams } = data;
  const featured = site.featuredIds
    .map((id) => cases.find((x) => x.id === id))
    .filter(Boolean);
  return (
    <>
      <section className="hero wrap">
        <div className="hero-kicker" data-enter>
          <Label>IDEAS INTO IMPACT</Label>
          <span>{site.eyebrow}</span>
        </div>
        <div className="hero-heading">
          <Title lines={site.title.split("\n")} />
          <div className="hero-side" data-enter>
            <div className="hero-orbit">
              <Star />
            </div>
            <p>{site.description}</p>
            <a className="text-link" href={href("cases")}>
              看看我们做过的事
              <Arrow diagonal />
            </a>
          </div>
        </div>
        <div className="hero-stage" data-enter>
          <Photo
            image={site.heroImage}
            loading="eager"
            fetchPriority="high"
            data-parallax
          />
          <div className="stage-shade" />
          <span className="stage-label">{site.heroCaption}</span>
          <a
            className="stage-link"
            href={href(
              cases.some((c) => c.id === site.heroCaseId)
                ? "case/" + site.heroCaseId
                : "cases",
            )}
          >
            <span>
              创意，发生在现场。<small>从屏幕里的想法，到真实世界的行动</small>
            </span>
            <span className="round-arrow">
              <Arrow diagonal />
            </span>
          </a>
          <span className="stage-corner">CREATED TO CONNECT</span>
        </div>
        <div className="brand-strip" data-reveal>
          <span>与不同品牌，一起创造</span>
          <div>1688</div>
          <div>支付宝</div>
          <div>美团</div>
          <div>快手</div>
          <div>飞书</div>
          <div>小红书</div>
        </div>
      </section>
      <section className="work-section wrap section-space">
        <div className="section-head" data-reveal>
          <div>
            <Label>SELECTED WORK / 精选案例</Label>
            <h2>
              每个项目，
              <br />
              都有自己的答案<span className="blue">。</span>
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
          <Label>WHAT WE DO / 我们能做什么</Label>
          <div className="statement-title" data-reveal>
            <h2>
              创意有很多种可能。
              <br />
              我们让它发生。
            </h2>
            <Star />
          </div>
          <div className="statement-body">
            <p data-reveal>
              好内容的背后，是对业务的理解，也是把每一件小事做好的团队。我们从具体的问题出发，让策略、内容和执行走到一起。
            </p>
            <Capabilities />
          </div>
        </div>
      </section>
      <section className="people-section wrap section-space">
        <div className="section-head" data-reveal>
          <div>
            <Label>THE PEOPLE / 一起做事的人</Label>
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
              认识我们的团队
              <Arrow diagonal />
            </a>
          </div>
        </div>
        <TeamExplorer data={data} />
        <a className="team-ribbon" href={href("teams")} data-reveal>
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
        <Label>THE NEXT GOOD IDEA</Label>
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
        <p>{site.contactText}</p>
      </div>
    </section>
  );
}

export { Home, ContactBanner };
