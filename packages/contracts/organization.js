export const rootTeams = (teams) => teams.filter((team) => !team.parentId);
export const childTeams = (teams, parentId) =>
  teams.filter((team) => team.parentId === parentId);
export const memberTeamIds = (member) => [
  ...new Set(
    [member.teamId, ...(member.additionalTeamIds || [])].filter(Boolean),
  ),
];
export const director = (data) =>
  data.members.find((member) => member.id === data.site.directorId) ||
  data.members.find((member) => member.name === "王小玉");
export function teamScope(teams, id) {
  const result = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const team of teams)
      if (team.parentId && result.has(team.parentId) && !result.has(team.id)) {
        result.add(team.id);
        changed = true;
      }
  }
  return result;
}
export function teamMembers(data, id, { recursive = true } = {}) {
  const scope = recursive ? teamScope(data.teams, id) : new Set([id]),
    lead = director(data);
  return data.members.filter(
    (member) =>
      member.id !== lead?.id &&
      memberTeamIds(member).some((id) => scope.has(id)),
  );
}
export function teamCases(data, id) {
  const scope = teamScope(data.teams, id),
    explicit = new Set(
      data.teams.filter((t) => scope.has(t.id)).flatMap((t) => t.caseIds || []),
    );
  return data.cases.filter(
    (item) => scope.has(item.teamId) || explicit.has(item.id),
  );
}
export function teamPath(teams, id) {
  const result = [],
    seen = new Set();
  let team = teams.find((t) => t.id === id);
  while (team && !seen.has(team.id)) {
    result.unshift(team);
    seen.add(team.id);
    team = teams.find((t) => t.id === team.parentId);
  }
  return result;
}
export function memberProjects(data, member) {
  const personal = (member.projectLinks || [])
    .map((link) => ({
      item: data.cases.find((c) => c.id === link.caseId),
      description: link.description,
      source: link.source,
    }))
    .filter((x) => x.item);
  const personalIds = new Set(personal.map((x) => x.item.id)),
    relatedIds = new Set();
  if (member.id === director(data)?.id)
    data.cases.forEach((c) => relatedIds.add(c.id));
  else
    for (const id of memberTeamIds(member)) {
      const path = teamPath(data.teams, id).reverse();
      for (const team of path) {
        const cases = teamCases(data, team.id);
        if (cases.length) {
          cases.forEach((c) => relatedIds.add(c.id));
          break;
        }
      }
    }
  return {
    personal,
    related: data.cases.filter(
      (c) => relatedIds.has(c.id) && !personalIds.has(c.id),
    ),
  };
}
