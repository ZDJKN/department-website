import Ajv from "ajv";
const string = { type: "string", maxLength: 20000 };
const id = { type: "string", pattern: "^[a-z0-9][a-z0-9-]{0,80}$" };
const image = {
  type: "object",
  additionalProperties: false,
  required: ["src", "alt"],
  properties: {
    src: { type: "string", pattern: "^/(media|uploads)/[a-zA-Z0-9_.-]+$" },
    alt: { type: "string", maxLength: 500 },
    fit: { enum: ["cover", "contain"] },
    width: { type: "number" },
    height: { type: "number" },
    caption: string,
  },
};
const source = {
  type: "object",
  additionalProperties: false,
  required: ["title", "pages"],
  properties: {
    title: string,
    pages: {
      type: "array",
      items: { type: "integer", minimum: 1 },
      maxItems: 138,
    },
    note: string,
  },
};
const array = (items) => ({ type: "array", maxItems: 1000, items });
const common = {
  id,
  name: { type: "string", minLength: 1, maxLength: 200 },
  visible: { type: "boolean" },
  order: { type: "integer", minimum: 0, maximum: 9999 },
  internalNote: string,
};
const schema = {
  type: "object",
  additionalProperties: false,
  required: ["site", "cases", "teams", "members"],
  properties: {
    site: {
      type: "object",
      additionalProperties: false,
      required: ["name", "title", "description", "featuredIds"],
      properties: {
        name: string,
        title: string,
        description: string,
        eyebrow: string,
        heroImage: image,
        heroCaption: string,
        heroCaseId: id,
        featuredIds: array(id),
        email: { type: "string", maxLength: 200 },
        contactText: string,
        contactImage: image,
        about: string,
        updatedAt: string,
        directorId: id,
      },
    },
    cases: array({
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "name",
        "visible",
        "client",
        "category",
        "summary",
        "background",
        "services",
        "results",
        "scope",
        "teamId",
        "order",
      ],
      properties: {
        ...common,
        client: string,
        category: string,
        summary: string,
        background: string,
        services: array(string),
        results: array({
          type: "array",
          minItems: 2,
          maxItems: 2,
          items: string,
        }),
        scope: string,
        cover: image,
        gallery: array(image),
        teamId: id,
        year: string,
        accent: { type: "string", pattern: "^#[a-fA-F0-9]{6}$" },
        source,
      },
    }),
    teams: array({
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "name",
        "visible",
        "order",
        "lead",
        "type",
        "summary",
        "description",
        "memberIds",
        "pending",
      ],
      properties: {
        ...common,
        parentId: id,
        caseIds: array(id),
        lead: string,
        type: string,
        summary: string,
        description: string,
        cover: image,
        memberIds: array(id),
        pending: { type: "boolean" },
        source,
      },
    }),
    members: array({
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "name",
        "visible",
        "order",
        "role",
        "bio",
        "experience",
        "teamId",
      ],
      properties: {
        ...common,
        role: string,
        bio: string,
        experience: string,
        photo: { anyOf: [image, { type: "null" }] },
        teamId: id,
        additionalTeamIds: array(id),
        projectLinks: array({
          type: "object",
          additionalProperties: false,
          required: ["caseId", "description"],
          properties: { caseId: id, description: string, source },
        }),
        source,
      },
    }),
  },
};
const ajv = new Ajv({ allErrors: true, strict: false }),
  check = ajv.compile(schema);
export function validateContent(content) {
  if (!check(content))
    return {
      ok: false,
      fields: check.errors.map((e) => ({
        path: e.instancePath,
        message: e.message,
      })),
    };
  for (const key of ["cases", "teams", "members"])
    if (new Set(content[key].map((x) => x.id)).size !== content[key].length)
      return { ok: false, fields: [{ path: key, message: "ID不能重复" }] };
  const teamIds = new Set(content.teams.map((x) => x.id)),
    caseIds = new Set(content.cases.map((x) => x.id));
  if (
    content.cases.some((x) => !teamIds.has(x.teamId)) ||
    content.members.some((x) => !teamIds.has(x.teamId))
  )
    return {
      ok: false,
      fields: [{ path: "teamId", message: "关联团队不存在" }],
    };
  const members = new Set(content.members.map((m) => m.id));
  if (content.site.directorId && !members.has(content.site.directorId))
    return {
      ok: false,
      fields: [{ path: "directorId", message: "组织负责人不存在" }],
    };
  for (const team of content.teams) {
    if (team.parentId && !teamIds.has(team.parentId))
      return {
        ok: false,
        fields: [{ path: "parentId", message: "上级团队不存在" }],
      };
    const seen = new Set([team.id]);
    let parent = team.parentId;
    while (parent) {
      if (seen.has(parent))
        return {
          ok: false,
          fields: [{ path: "parentId", message: "组织结构不能循环引用" }],
        };
      seen.add(parent);
      parent = content.teams.find((t) => t.id === parent)?.parentId;
    }
    if ((team.caseIds || []).some((id) => !caseIds.has(id)))
      return {
        ok: false,
        fields: [{ path: "caseIds", message: "团队关联案例不存在" }],
      };
  }
  for (const member of content.members) {
    if ((member.additionalTeamIds || []).some((id) => !teamIds.has(id)))
      return {
        ok: false,
        fields: [{ path: "additionalTeamIds", message: "协作团队不存在" }],
      };
    if ((member.projectLinks || []).some((link) => !caseIds.has(link.caseId)))
      return {
        ok: false,
        fields: [{ path: "projectLinks", message: "个人关联案例不存在" }],
      };
    if (
      new Set((member.projectLinks || []).map((l) => l.caseId)).size !==
      (member.projectLinks || []).length
    )
      return {
        ok: false,
        fields: [{ path: "projectLinks", message: "个人案例不能重复" }],
      };
  }
  if (content.site.heroCaseId && !caseIds.has(content.site.heroCaseId))
    return {
      ok: false,
      fields: [{ path: "heroCaseId", message: "首屏关联案例不存在" }],
    };
  if (content.site.featuredIds.some((x) => !caseIds.has(x)))
    return {
      ok: false,
      fields: [{ path: "featuredIds", message: "精选案例不存在" }],
    };
  return { ok: true };
}
