import test from "node:test";
import assert from "node:assert/strict";
import {
  createCaseIndex,
  findCases,
  readCaseFilters,
  caseFilterHash,
} from "../../apps/web/src/lib/case-discovery.js";
const data = {
  site: {},
  teams: [
    { id: "root", name: "内容团队" },
    { id: "child", name: "制作小组", parentId: "root", caseIds: ["two"] },
    { id: "other", name: "其他团队" },
  ],
  cases: [
    {
      id: "one",
      name: "品牌活动",
      client: "Brand",
      category: "品牌内容",
      summary: "内容策划",
      services: ["海报设计与AI数字人"],
      background: "人物访谈",
      teamId: "child",
    },
    {
      id: "two",
      name: "直播项目",
      client: "客户乙",
      category: "直播",
      summary: "现场运营",
      services: [],
      teamId: "other",
    },
  ],
  members: [
    {
      id: "m",
      name: "甲同学",
      role: "设计师",
      teamId: "child",
      bio: "曾服务过客户乙",
      projectLinks: [{ caseId: "one", description: "负责主KV与海报" }],
    },
  ],
};
const ids = (filters) =>
  findCases(createCaseIndex(data), filters).map((c) => c.id);
test("searches real case content and handles whitespace, case and combined keywords", () => {
  assert.deepEqual(ids({ q: "海报" }), ["one"]);
  assert.deepEqual(ids({ q: " BRAND  ai " }), ["one"]);
  assert.deepEqual(ids({ q: "人物访谈" }), ["one"]);
  assert.deepEqual(ids({ q: "海报 不存在" }), []);
});
test("member search matches explicit project participation rather than the entire team's work", () => {
  assert.deepEqual(ids({ q: "甲同学" }), ["one"]);
  assert.deepEqual(ids({ q: "设计师" }), ["one"]);
});
test("team filtering includes children and explicit group case references, then intersects category", () => {
  assert.deepEqual(ids({ team: "root" }), ["one", "two"]);
  assert.deepEqual(ids({ team: "root", category: "直播" }), ["two"]);
  assert.deepEqual(ids({ team: "missing" }), []);
});
test("shareable hash roundtrips Chinese filters, normalizes invalid IDs and preserves a blank state", () => {
  const filters = { q: "海报 设计", team: "root", category: "品牌内容" };
  assert.deepEqual(readCaseFilters(caseFilterHash(filters), data), filters);
  assert.deepEqual(
    readCaseFilters("#/cases?team=missing&category=missing", data),
    { q: "", team: "", category: "" },
  );
  assert.equal(caseFilterHash({ q: "", team: "", category: "" }), "#/cases");
});
