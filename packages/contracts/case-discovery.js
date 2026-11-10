import { teamCases, teamPath } from "./organization.js";

const normalize = (value) =>
  String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .trim();

export function createCaseIndex(data) {
  return {
    data,
    entries: data.cases.map((item) => {
      const people = data.members.flatMap((member) =>
        (member.projectLinks || [])
          .filter((link) => link.caseId === item.id)
          .map((link) =>
            [member.name, member.role, link.description].join(" "),
          ),
      );
      return {
        item,
        text: normalize(
          [
            item.client,
            item.name,
            item.category,
            item.summary,
            item.background,
            ...(item.services || []),
            ...(item.results || []).flat(),
            ...teamPath(data.teams, item.teamId).map((team) => team.name),
            ...people,
          ].join(" "),
        ),
      };
    }),
  };
}

export function findCases(index, { q = "", category = "", team = "" } = {}) {
  const words = normalize(q).split(/\s+/).filter(Boolean);
  const allowed = team
    ? new Set(teamCases(index.data, team).map((c) => c.id))
    : null;
  return index.entries
    .filter(
      ({ item, text }) =>
        (!category || item.category === category) &&
        (!allowed || allowed.has(item.id)) &&
        words.every((word) => text.includes(word)),
    )
    .map(({ item }) => item);
}

export function readCaseFilters(hash, data) {
  const params = new URLSearchParams(hash.split("?")[1] || "");
  const category = params.get("category") || "",
    team = params.get("team") || "";
  return {
    q: (params.get("q") || "").slice(0, 200),
    category: data.cases.some((c) => c.category === category) ? category : "",
    team: data.teams.some((t) => t.id === team) ? team : "",
  };
}

export function caseFilterHash({ q = "", team = "", category = "" }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (team) params.set("team", team);
  if (category) params.set("category", category);
  return "#/cases" + (params.size ? "?" + params.toString() : "");
}
