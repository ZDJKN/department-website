import test from "node:test";
import assert from "node:assert/strict";
import {
  publicMember,
  assertMemberPublication,
} from "../../packages/contracts/member-publication.js";
const identity = {
  id: "member-huang-meiyue",
  name: "黄妹月",
  role: "高级新媒体运营",
  teamId: "group-zhazha",
  order: 72,
  bio: "",
  experience: "",
  photo: null,
  additionalTeamIds: [],
  projectLinks: [],
};
test("identity-only publication rejects fields outside the approved scope", () => {
  assert.doesNotThrow(() => assertMemberPublication(identity));
  for (const patch of [
    { photo: { src: "media/unapproved-test.webp", alt: "test" } },
    { bio: "unapproved biography" },
    { experience: "unapproved experience" },
    {
      projectLinks: [
        { caseId: "test", description: "unapproved participation" },
      ],
    },
    { additionalTeamIds: ["test"] },
    { futureField: "unapproved extra data" },
    { source: { title: "unapproved source", pages: [] } },
  ])
    assert.throws(
      () => assertMemberPublication({ ...identity, ...patch }),
      /公开范围/,
    );
});
test("identity-only projection preserves permitted fields and leaves other profiles untouched", () => {
  const raw = {
    ...identity,
    bio: "private biography",
    experience: "private history",
    photo: { src: "/media/unapproved-test.webp" },
    futureField: "private",
  };
  assert.deepEqual(publicMember(raw), identity);
  assert.equal(raw.bio, "private biography");
  const other = { ...raw, id: "unrestricted-test" };
  assert.equal(publicMember(other), other);
});
