import React from "react";
import { Arrow, Photo, href, Label, pad } from "./ui.jsx";
import { MemberLink, MemberImage } from "./MemberLink.jsx";
import {
  rootTeams,
  childTeams,
  teamMembers,
  director as getDirector,
} from "../../../../packages/contracts/organization.js";
function Members({ data, team, lead, compact }) {
  const list = teamMembers(data, team.id, { recursive: false }).filter(
    (m) => m.id !== lead?.id,
  );
  if (compact || !list.length) return null;
  return (
    <details className="organization-members">
      <summary>
        <span>
          {lead ? "其他成员" : "展开成员"} <b>{list.length}</b>
        </span>
        <span className="members-toggle" aria-hidden="true">
          +
        </span>
      </summary>
      <ul>
        {list.map((member) => (
          <li key={member.id}>
            <MemberLink member={member} />
          </li>
        ))}
      </ul>
    </details>
  );
}
function Branch({ data, team, depth = 0, compact = false, index = 0 }) {
  const children = childTeams(data.teams, team.id),
    members = teamMembers(data, team.id, { recursive: false }),
    lead = members.find((m) => m.name === team.lead);
  const Heading = depth === 0 ? "h4" : depth === 1 ? "h5" : "h6";
  return (
    <article
      className={
        (depth === 0 ? "organization-team" : "organization-subgroup") +
        (team.pending ? " organization-pending" : "")
      }
    >
      <div className="organization-team-link">
        <a href={href("team/" + team.id)} className="organization-unit-link">
          {depth === 0 && (
            <div className="organization-team-meta">
              <span>{pad(index + 1)}</span>
              <Arrow diagonal />
            </div>
          )}
          {depth === 0 && (
            <span className="organization-team-type">{team.type}</span>
          )}
          <Heading>
            {team.name}
            {depth > 0 && <Arrow diagonal />}
          </Heading>
        </a>
        {lead ? (
          <MemberLink member={lead} cover={team.cover} lead />
        ) : depth === 0 ? (
          <div className="organization-lead">
            {team.cover ? (
              <Photo image={team.cover} />
            ) : (
              <span className="organization-avatar" aria-hidden="true">
                {team.pending ? "+" : "✳"}
              </span>
            )}
            <span>
              {team.lead || "团队协作"}
              <small>{team.type}</small>
            </span>
          </div>
        ) : team.cover ? (
          <Photo image={team.cover} className="subgroup-cover" />
        ) : null}
        {!compact && depth === 0 && (
          <p className="organization-team-summary">{team.summary}</p>
        )}
        {depth > 0 && !compact && (
          <span className="subgroup-count">
            {teamMembers(data, team.id).length} 位成员资料
            {team.pending ? " · 持续补充" : ""}
          </span>
        )}
      </div>
      {children.length > 0 && (
        <ul
          className="organization-subgroups"
          aria-label={team.name + "下属小组"}
        >
          {children.map((child, i) => (
            <li key={child.id}>
              <Branch
                data={data}
                team={child}
                depth={depth + 1}
                compact={compact}
                index={i}
              />
            </li>
          ))}
        </ul>
      )}
      <Members data={data} team={team} lead={lead} compact={compact} />
      {!children.length && !members.length && (
        <a className="organization-team-more" href={href("team/" + team.id)}>
          查看小组介绍
          <Arrow diagonal />
        </a>
      )}
    </article>
  );
}
function Organization({ data, compact = false }) {
  const director = getDirector(data),
    roots = rootTeams(data.teams);
  return (
    <div className={"organization " + (compact ? "organization-compact" : "")}>
      {director && (
        <article
          className="organization-director"
          aria-label={director.name + "介绍"}
          data-reveal
        >
          <a
            className="director-photo"
            href={href("person/" + director.id)}
            aria-label={"查看" + director.name + "的完整介绍"}
          >
            <MemberImage member={director} />
            <span className="director-photo-arrow">
              <Arrow diagonal />
            </span>
          </a>
          <div className="director-intro">
            <Label>TEAM LEAD / 团队负责人</Label>
            <div className="director-name">
              <h3>{director.name}</h3>
              <span>{director.role}</span>
            </div>
            <p>{director.bio}</p>
            <a className="text-link" href={href("person/" + director.id)}>
              了解{director.name}
              <Arrow diagonal />
            </a>
          </div>
          <span className="director-signature" aria-hidden="true">
            PEOPLE
            <br />
            MAKE IT
            <br />
            HAPPEN.
          </span>
        </article>
      )}
      {roots.length > 0 && (
        <>
          <div className="organization-connector">
            <span>团队 · 小组 · 成员</span>
          </div>
          <ol
            className="organization-branches"
            aria-label="协作团队"
            style={{
              "--branch-count": roots.length,
              "--tree-width": `${roots.length * 270}px`,
            }}
          >
            {roots.map((team, index) => (
              <li className="organization-branch" key={team.id}>
                <Branch
                  data={data}
                  team={team}
                  compact={compact}
                  index={index}
                />
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
export { Organization };
