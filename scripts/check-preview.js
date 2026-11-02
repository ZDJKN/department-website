import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { validatePreviewSnapshot } from "../packages/contracts/public-preview-schema.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const content = JSON.parse(
  await readFile(resolve(root, "content/site.json"), "utf8"),
);
validatePreviewSnapshot(content);
const blocked =
  /毛利|利润|外协降本|月营收|累计创收|报价|薪资|工资|绩效|考核|https?:\/\/[^\s"<>]*(?:feishu\.cn|larksuite\.com|dingtalk\.com)/i;
if (blocked.test(JSON.stringify(content)))
  throw new Error("公开内容检查失败：发现内部经营信息或文档链接。");
const images = new Set();
function visit(item) {
  if (!item || typeof item !== "object") return;
  for (const [key, value] of Object.entries(item)) {
    if (["source", "internalNote"].includes(key))
      throw new Error("公开快照含私有元数据。");
    if (key === "src") {
      if (!/^media\/[a-zA-Z0-9_.-]+\.(webp|png|jpe?g|gif|avif)$/i.test(value))
        throw new Error("素材路径无效：" + value);
      images.add(value);
    } else visit(value);
  }
}
visit(content);
for (const path of images)
  if (!(await stat(resolve(root, path))).isFile())
    throw new Error("素材缺失：" + path);
console.log(
  `公开快照检查通过：${content.cases.length} 案例、${content.teams.length} 组织节点、${content.members.length} 成员、${images.size} 素材。`,
);
