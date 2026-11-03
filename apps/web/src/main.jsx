import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { loadContent, isStaticPreview } from "./api.js";
import { usePageMotion } from "./motion.js";
import { Header, Footer } from "./components/layout.jsx";
import { NotFound } from "./components/ui.jsx";
import { Home } from "./pages/Home.jsx";
import { Cases, CaseDetail } from "./pages/Cases.jsx";
import { Teams, TeamDetail, Person } from "./pages/Teams.jsx";
import { About, Contact } from "./pages/Static.jsx";
import "./site.css";
function App() {
  const [route, setRoute] = useState(() =>
      location.hash.replace(/^#\/?/, "").replace(/\/$/, ""),
    ),
    [data, setData] = useState(null),
    [error, setError] = useState("");
  const preview =
    !isStaticPreview &&
    new URLSearchParams(location.search).get("preview") === "1";
  useEffect(() => {
    loadContent(preview)
      .then(setData)
      .catch((e) => setError(e.message));
    let previousPath = location.hash.split("?")[0];
    const onHash = () => {
      const nextPath = location.hash.split("?")[0];
      setRoute(location.hash.replace(/^#\/?/, "").replace(/\/$/, ""));
      if (nextPath !== previousPath)
        window.scrollTo({ top: 0, behavior: "instant" });
      previousPath = nextPath;
    };
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);
  const routePath = route.split("?")[0];
  usePageMotion(routePath, !!data);
  useEffect(() => {
    if (!data) return;
    const [k, id] = routePath.split("/");
    const title =
      k === "case"
        ? data.cases.find((c) => c.id === id)?.client
        : k === "team"
          ? data.teams.find((t) => t.id === id)?.name
          : {
              cases: "项目案例",
              teams: "我们的团队",
              about: "关于我们",
              contact: "聊聊合作",
            }[k];
    document.title =
      (title ? title + " · " : "") + data.site.name + " · 让好内容，真正发生。";
  }, [route, data]);
  if (error)
    return (
      <main className="loading">
        <h1>内容暂时无法加载</h1>
        <p>{error}</p>
        <button onClick={() => location.reload()}>重新加载</button>
        {preview && <a href="/admin/">前往后台登录</a>}
      </main>
    );
  if (!data)
    return (
      <main className="loading">
        <span className="loading-mark">点石成金</span>
        <p>让好内容，真正发生。</p>
      </main>
    );
  const [k, id] = routePath.split("/");
  let page =
    k === "" ? (
      <Home data={data} />
    ) : k === "cases" ? (
      <Cases data={data} hash={"#/" + route} />
    ) : k === "case" ? (
      <CaseDetail data={data} id={id} />
    ) : k === "teams" ? (
      <Teams data={data} />
    ) : k === "team" ? (
      <TeamDetail data={data} id={id} />
    ) : k === "person" ? (
      <Person data={data} id={id} />
    ) : k === "about" ? (
      <About data={data} />
    ) : k === "contact" ? (
      <Contact data={data} />
    ) : (
      <NotFound />
    );
  return (
    <>
      {preview && (
        <div className="preview-banner">
          草稿预览 · 尚未发布<a href="/admin/">返回内容后台 ↗</a>
        </div>
      )}
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main").focus();
        }}
      >
        跳到正文
      </a>
      <Header route={routePath} site={data.site} />
      <main id="main" tabIndex={-1} key={routePath}>
        {page}
      </main>
      <Footer site={data.site} />
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
