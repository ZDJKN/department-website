import React from "react";
import { Arrow, Photo, href } from "./ui.jsx";
export function MemberImage({ member, cover }) {
  return cover || member?.photo ? (
    <Photo image={cover || member.photo} />
  ) : (
    <span className="member-initial" aria-hidden="true">
      {member?.name?.slice(0, 1) || "✳"}
    </span>
  );
}
export function MemberLink({ member, cover, lead = false }) {
  return (
    <a
      className={"member-link " + (lead ? "member-lead" : "")}
      href={href("person/" + member.id)}
    >
      <MemberImage member={member} cover={cover} />
      <span>
        {member.name}
        <small>{member.role}</small>
      </span>
      <Arrow diagonal />
    </a>
  );
}
