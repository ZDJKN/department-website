import { validateContent } from "./content-schema.js";
import { assertMemberPublication } from "./member-publication.js";

export function validatePreviewSnapshot(content) {
  const normalized = JSON.parse(
    JSON.stringify(content, (key, value) => {
      if (key === "src") {
        if (
          typeof value !== "string" ||
          !/^media\/[a-zA-Z0-9_.-]+\.(webp|png|jpe?g|gif|avif)$/i.test(value)
        )
          throw new Error("公开素材路径无效。");
        return "/" + value;
      }
      return value;
    }),
  );
  for (const key of ["cases", "teams", "members"])
    if (Array.isArray(normalized[key]))
      for (const record of normalized[key]) record.visible = true;
  const result = validateContent(normalized);
  if (!result.ok)
    throw new Error("公开内容结构或引用无效：" + JSON.stringify(result.fields));
  for (const member of content.members) assertMemberPublication(member);
}
