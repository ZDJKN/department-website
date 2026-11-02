import React from "react";
import { Arrow, Star, href, Photo, Label, Title } from "../components/ui.jsx";
import { Capabilities } from "../components/capabilities.jsx";
import { ContactBanner } from "./Home.jsx";
function About({ data }) {
  return (
    <>
      <section className="wrap page-main">
        <div className="page-heading">
          <Label>ABOUT DIANSHI / 关于我们</Label>
          <Title lines={["一群认真做事的人，", "让好内容发生。"]} />
        </div>
        <div className="about-grid">
          <p className="about-intro" data-enter>
            {data.site.about}
          </p>
          <div data-enter>
            <Label>OUR APPROACH</Label>
            <p>
              理解问题，找到表达，走到现场。我们相信每一个好作品，都来自不同专业之间扎实的协作。
            </p>
            <a className="text-link" href={href("teams")}>
              认识这群人
              <Arrow diagonal />
            </a>
          </div>
        </div>
        <div className="about-photo" data-reveal>
          <Photo image={data.site.heroImage} />
          <span>{data.site.heroCaption}</span>
        </div>
        <div className="about-services">
          <Label>STRATEGY TO EXECUTION</Label>
          <Capabilities />
        </div>
      </section>
      <ContactBanner site={data.site} />
    </>
  );
}

function Contact({ data }) {
  const { site } = data;
  return (
    <section className="contact-page wrap">
      <Label>LET’S TALK / 聊聊合作</Label>
      <Title lines={["从一个问题开始，", "做点有意思的事。"]} />
      <div className="contact-content">
        <Star />
        <div>
          <p>{site.contactText}</p>
          {site.email ? (
            <a className="contact-email" href={"mailto:" + site.email}>
              {site.email}
              <Arrow diagonal />
            </a>
          ) : (
            <>
              <p className="contact-note">
                通过你熟悉的项目负责人，联系小题旅行运营四部。
                <br />
                我们一起聊聊品牌、内容，以及下一步的可能。
              </p>
              <a className="pill-link" href={href("teams")}>
                认识团队
                <Arrow diagonal />
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export { About, Contact };
