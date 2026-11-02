import React, { useEffect, useRef, useState } from "react";
import { Arrow, Label, href, pad } from "./ui.jsx";
import { MemberImage, MemberLink } from "./MemberLink.jsx";
import {
  childTeams,
  director as getDirector,
  rootTeams,
  teamMembers,
} from "../../../../packages/contracts/organization.js";
import { refreshPageMotion } from "../motion.js";
import "../team-explorer.css";

function ToggleMark() {
  return (
    <span className="explorer-toggle" aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

function ExplorerMembers({ members, label = "成员" }) {
  if (!members.length) return null;
  return (
    <div className="explorer-roster">
      <p className="explorer-roster-label">
        {label}
        <span>{members.length}</span>
      </p>
      <ul className="explorer-member-grid">
        {members.map((member) => (
          <li key={member.id}>
            <MemberLink member={member} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroupDisclosure({ data, group }) {
  const children = childTeams(data.teams, group.id);
  const members = teamMembers(data, group.id, { recursive: false });
  return (
    <details
      className="explorer-group"
      name={"home-subgroups-" + group.parentId}
    >
      <summary>
        <span className="explorer-group-title">
          {group.name}
          <small>
            {children.length
              ? `${children.length} 个下属小组`
              : `${members.length} 位成员资料`}
          </small>
        </span>
        <ToggleMark />
      </summary>
      <div className="explorer-group-content">
        {group.summary && (
          <p className="explorer-group-description">{group.summary}</p>
        )}
        {children.length > 0 && (
          <div className="explorer-nested-groups">
            {children.map((child) => (
              <GroupDisclosure key={child.id} data={data} group={child} />
            ))}
          </div>
        )}
        <ExplorerMembers
          members={members}
          label={children.length ? "团队成员" : "成员"}
        />
        {!children.length && !members.length && (
          <p className="explorer-empty">成员介绍正在整理。</p>
        )}
        <a className="explorer-detail-link" href={href("team/" + group.id)}>
          小组介绍与相关案例
          <Arrow diagonal />
        </a>
      </div>
    </details>
  );
}

function TeamExplorer({ data }) {
  const [activeTeamId, setActiveTeamId] = useState(null);
  const container = useRef(null);
  const director = getDirector(data),
    teams = rootTeams(data.teams);

  // Native disclosures change the page height. Refresh downstream reveals after
  // layout settles, without measuring DOM during render or scrolling the user.
  useEffect(() => {
    let frame;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(refreshPageMotion);
    });
    if (container.current) observer.observe(container.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={container}
      className={
        "team-explorer" + (director ? "" : " explorer-without-director")
      }
    >
      {director && (
        <article
          className="explorer-director"
          aria-label={director.name + "介绍"}
        >
          <div className="explorer-director-heading">
            <Label>TEAM LEAD</Label>
            <span className="explorer-director-number">01</span>
          </div>
          <a
            className="explorer-director-photo"
            href={href("person/" + director.id)}
            aria-label={"查看" + director.name + "的介绍与项目"}
          >
            <MemberImage member={director} />
            <span>
              <Arrow diagonal />
            </span>
          </a>
          <div className="explorer-director-name">
            <h3>{director.name}</h3>
            <span>{director.role}</span>
          </div>
          <p className="explorer-director-bio">{director.bio}</p>
          <a className="text-link" href={href("person/" + director.id)}>
            认识{director.name}
            <Arrow diagonal />
          </a>
        </article>
      )}
      <div className="explorer-directory">
        <div className="explorer-directory-heading">
          <Label>OUR TEAMS / 团队</Label>
          <span>{pad(teams.length)} 个协作团队</span>
        </div>
        <div className="explorer-team-list">
          {teams.map((team, index) => {
            const children = childTeams(data.teams, team.id);
            const members = teamMembers(data, team.id, { recursive: false });
            const lead = members.find((member) => member.name === team.lead);
            const active = activeTeamId === team.id;
            const panelId = "home-team-panel-" + team.id,
              buttonId = "home-team-button-" + team.id;
            return (
              <article
                className={"explorer-team" + (active ? " is-open" : "")}
                key={team.id}
              >
                <h3 className="explorer-team-heading">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={active}
                    aria-controls={panelId}
                    onClick={() => setActiveTeamId(active ? null : team.id)}
                  >
                    <span className="explorer-team-index" aria-hidden="true">
                      {pad(index + 1)}
                    </span>
                    <span className="explorer-team-avatar">
                      <MemberImage member={lead} cover={team.cover} />
                    </span>
                    <span className="explorer-team-title">
                      {team.name}
                      <small>
                        {team.type}
                        {team.lead && !team.pending ? " · " + team.lead : ""}
                      </small>
                    </span>
                    <span className="explorer-team-count">
                      {children.length
                        ? `${children.length} 个小组`
                        : `${members.length} 位成员`}
                    </span>
                    <ToggleMark />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!active}
                >
                  {active && (
                    <div className="explorer-team-panel">
                      <div className="explorer-panel-intro">
                        <p>{team.summary}</p>
                        <a href={href("team/" + team.id)}>
                          团队介绍
                          <Arrow diagonal />
                        </a>
                      </div>
                      {children.length > 0 && (
                        <div className="explorer-groups">
                          {children.map((group) => (
                            <GroupDisclosure
                              key={group.id}
                              data={data}
                              group={group}
                            />
                          ))}
                        </div>
                      )}
                      {children.length && members.length ? (
                        <details
                          className="explorer-direct-members"
                          name={"home-subgroups-" + team.id}
                        >
                          <summary>
                            <span>
                              团队成员 <small>{members.length}</small>
                            </span>
                            <ToggleMark />
                          </summary>
                          <ExplorerMembers members={members} label="团队成员" />
                        </details>
                      ) : (
                        <ExplorerMembers members={members} label="团队成员" />
                      )}
                      {!children.length && !members.length && (
                        <p className="explorer-empty">团队资料正在更新。</p>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {!teams.length && <p className="explorer-empty">团队资料正在更新。</p>}
      </div>
    </div>
  );
}
export { TeamExplorer };
