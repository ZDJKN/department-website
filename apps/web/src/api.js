export const isStaticPreview = import.meta.env.VITE_PUBLIC_PREVIEW === "true";

export async function loadContent(preview = false) {
  if (isStaticPreview) {
    const url = new URL("content/site.json", document.baseURI);
    const request = () =>
      fetch(url, { credentials: "omit", cache: "no-cache" }).catch(() => null);
    let response = await request();
    if (!response || response.status >= 500) response = await request();
    if (!response?.ok) throw new Error("预览内容暂时无法加载。");
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
