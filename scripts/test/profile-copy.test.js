import test from "node:test";
import assert from "node:assert/strict";
import { profileParagraphs } from "../../apps/web/src/lib/profile-copy.js";
const compact = (value) => value.replace(/\s/g, "");
test("profile paragraphs preserve source facts while separating enumerated experience", () => {
  const text =
    "核心能力：内容策划\r\n\r\n1、2025年参与项目，ROI从2.1到3.7。2、注册率93.52%，产出10万+内容。\n\n3、服务品牌与活动。";
  const paragraphs = profileParagraphs(text);
  assert.deepEqual(paragraphs, [
    "核心能力：内容策划",
    "1、2025年参与项目，ROI从2.1到3.7。",
    "2、注册率93.52%，产出10万+内容。",
    "3、服务品牌与活动。",
  ]);
  assert.equal(compact(paragraphs.join("")), compact(text));
});
test("unstructured biographies, decimals and empty content remain safe", () => {
  assert.deepEqual(profileParagraphs("3.5年经验（1年品牌策划+2.5年运营）"), [
    "3.5年经验（1年品牌策划+2.5年运营）",
  ]);
  assert.deepEqual(profileParagraphs("2019、2020年参与项目"), [
    "2019、2020年参与项目",
  ]);
  assert.deepEqual(profileParagraphs(" \r\n "), []);
  assert.deepEqual(profileParagraphs(undefined), []);
});
