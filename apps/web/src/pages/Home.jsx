import React, { useState } from "react";
import { Arrow, href, pad, Photo, Label, Title } from "../components/ui.jsx";
import { CaseCard } from "../components/work.jsx";
import { rootTeams } from "../../../../packages/contracts/organization.js";
import { TeamExplorer } from "../components/TeamExplorer.jsx";
import { Capabilities } from "../components/capabilities.jsx";
import "../home-studio.css";

function Home({ data }) {
  const { site, cases, teams } = data;
  const featured = site.featuredIds
    .map((id) => cases.find((x) => x.id === id))
    .filter(Boolean);
  const photos = [site.heroImage, ...(site.heroGallery || [])]
    .filter(Boolean)
    .filter(
      (image, index, images) =>
        images.findIndex((other) => other.src === image.src) === index,
    );
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const photo =
    photos.find((image) => image.src === selectedPhoto) || photos[0];
  const caption =
    (photo?.src === site.heroImage?.src ? site.heroCaption : photo?.caption) ||
    photo?.alt ||
    "团队合照";
  return (
    <>
      <section className="studio-masthead wrap">
        <div className="studio-masthead-copy">
          <p className="studio-masthead-label" data-enter>
            <span>DIANSHI STUDIO</span>
            {site.eyebrow}
          </p>
          <Title lines={site.title.split("\n")} />
          <p className="studio-masthead-description" data-enter>
            {site.description}
          </p>
          <div className="studio-masthead-actions" data-enter>
            <a href={href("cases")}>
              浏览项目 <Arrow diagonal />
            </a>
            <a href={href("teams")}>
              认识团队 <Arrow />
            </a>
          </div>
        </div>
        <figure className="studio-field-note" data-enter>
          <div className="studio-field-photo">
            <Photo
              image={photo}
              loading="eager"
              fetchPriority="high"
              width={photo?.width || 1800}
              height={photo?.height || 1200}
              style={{ objectFit: "contain" }}
            />
          </div>
          <figcaption className="studio-field-caption">
            <span aria-live="polite" aria-atomic="true">
              {caption}
            </span>
            <a className="studio-field-action" href={href("teams")}>
              认识团队 <Arrow diagonal />
            </a>
          </figcaption>
          {photos.length > 1 && (
            <div
              className="studio-photo-selector"
              role="group"
              aria-label="选择团队合照"
            >
              {photos.map((image, index) => (
                <button
                  type="button"
                  key={image.src}
                  aria-pressed={photo.src === image.src}
                  aria-label={`查看第 ${index + 1} 张团队合照，${image.caption || image.alt}`}
                  onClick={() => setSelectedPhoto(image.src)}
                >
                  <span aria-hidden="true">{pad(index + 1)}</span>
                  {image.caption || image.alt}
                </button>
              ))}
            </div>
          )}
        </figure>
        <div className="studio-brand-index" aria-label="合作项目涉及的品牌">
          <span>项目涉及品牌</span>
          <ul>
            {["1688", "支付宝", "美团", "快手", "飞书", "小红书"].map(
              (brand) => (
                <li key={brand}>{brand}</li>
              ),
            )}
          </ul>
        </div>
      </section>
      <section
        id="selected-work"
        tabIndex={-1}
        className="work-section studio-selected wrap section-space"
      >
        <div className="section-head" data-reveal>
          <div>
            <Label>01 / SELECTED WORK</Label>
            <h2>
              精选项目<span className="blue">。</span>
            </h2>
          </div>
          <a className="pill-link" href={href("cases")}>
            查看全部 {pad(cases.length)} 个项目
            <Arrow diagonal />
          </a>
        </div>
        <div className="work-grid">
          {featured.map((c, i) => (
            <CaseCard key={c.id} item={c} index={i} featured onePagePreview />
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
