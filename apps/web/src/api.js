export const isStaticPreview = import.meta.env.VITE_PUBLIC_PREVIEW === "true";

export async function loadContent(preview = false) {
  if (isStaticPreview) {
    const response = await fetch(
      new URL("content/site.json", document.baseURI),
      { credentials: "omit", cache: "no-cache" },
    );
    if (!response.ok) throw new Error("预览内容暂时无法加载。");
    return response.json();
  }
  const response = await fetch(
    preview ? "/api/v1/admin/preview" : "/api/v1/site",
    { credentials: "same-origin", cache: "no-store" },
  );
  const body = await response.json();
  if (!response.ok)
    throw new Error(
      preview
        ? "草稿预览需要先登录内容后台。"
        : body.error?.message || "内容暂时无法加载。",
    );
  return body.data;
}
