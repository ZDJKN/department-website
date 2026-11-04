// 黄妹月: user-selected identity-only scope. New directory-only profiles have
// verified names, roles and primary groups; detailed materials need review first.
const identityOnlyIds = new Set([
  "member-huang-meiyue",
  "member-chen-zile",
  "member-wu-xueqing",
]);

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
