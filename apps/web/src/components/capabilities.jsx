import React, { useState } from "react";
const capabilities = [
  [
    "01",
    "内容，把品牌带进生活",
    "Brand & Content",
    "品牌官号、内容 IP、小红书种草、创意短视频。找到品牌与用户之间自然的连接，让产品信息变成愿意被观看、被分享的内容。",
  ],
  [
    "02",
    "运营，让连接持续发生",
    "Social & Community",
    "从 KOS / KOC 矩阵到社群运营，让内容、平台和真实的人形成持续的关系，建立可执行、可复盘的运营节奏。",
  ],
  [
    "03",
    "直播，让体验发生在现场",
    "Live & Experience",
    "从产品演示、店播到城市与目的地专场，协同策划、主播、场控与制作，把一个想法完整地带到现场。",
  ],
  [
    "04",
    "协作，把想法变成作品",
    "Production & Growth",
    "编导、拍摄、后期、投放与数据支持共同工作。以具体业务问题为起点，在执行中验证，在反馈中优化。",
  ],
];

function Capabilities() {
  const [active, setActive] = useState(0);
  return (
    <div className="capabilities">
      {capabilities.map(([n, title, en, desc], i) => (
        <div
          className={"capability " + (active === i ? "active" : "")}
          key={n}
          data-reveal
        >
          <button
            onClick={() => setActive(active === i ? -1 : i)}
            aria-expanded={active === i}
            aria-controls={"cap-" + i}
          >
            <span>{n}</span>
            <h3>
              {title}
              <small>{en}</small>
            </h3>
            <b>{active === i ? "−" : "+"}</b>
          </button>
          <div id={"cap-" + i} hidden={active !== i}>
            <p>{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export { capabilities, Capabilities };
