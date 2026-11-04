// User-selected scope: name, role and primary group only (2026-11-04).
const identityOnlyIds = new Set(["member-huang-meiyue"]);

export function publicMember(member) {
  if (!identityOnlyIds.has(member.id)) return member;
  return {
    ...Object.fromEntries(
      ["id", "name", "role", "teamId", "order"]
        .filter((key) => member[key] !== undefined)
        .map((key) => [key, member[key]]),
    ),
    bio: "",
    experience: "",
    photo: null,
    additionalTeamIds: [],
    projectLinks: [],
  };
}

export function assertMemberPublication(member) {
  if (!identityOnlyIds.has(member.id)) return;
  const allowed = publicMember(member);
  const keys = new Set([...Object.keys(member), ...Object.keys(allowed)]);
  for (const key of keys)
    if (JSON.stringify(member[key]) !== JSON.stringify(allowed[key]))
      throw new Error("成员资料超出已确认的公开范围：" + member.id + "." + key);
}
