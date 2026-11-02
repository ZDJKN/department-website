import React, { useState } from "react";
import {
  Arrow,
  Star,
  href,
  Label,
  Title,
  NotFound,
} from "../components/ui.jsx";
import { Organization } from "../components/Organization.jsx";
import { MemberImage } from "../components/MemberLink.jsx";
import { CaseCard, Source } from "../components/work.jsx";
import {
  childTeams,
  teamMembers,
  teamCases,
  teamPath,
  memberProjects,
  memberTeamIds,
  director,
} from "../../../../packages/contracts/organization.js";
function Teams({ data }) {
  return (
    <section className="wrap page-main">
      <div className="page-heading">
        <Label>OUR PEOPLE / 我们的团队</Label>
        <div className="page-heading-row">
          <Title lines={["各有所长，", "一起成事。"]} />
          <p data-enter>
            从团队到小组，
            <br />
            认识一起把事情做好的人。
          </p>
        </div>
      </div>
      <Organization data={data} />
      <div className="team-note">
        <Star />
        <p>
          以项目连接专业，
          <br />
          让不同的能力成为同一个答案。
        </p>
      </div>
    </section>
  );
}
function TeamBreadcrumb({ data, id }) {
  const path = teamPath(data.teams, id);
  return (
    <nav className="team-breadcrumb" aria-label="组织路径">
      <a href={href("teams")}>全部团队</a>
      {path.map((team, index) => (
        <React.Fragment key={team.id}>
          <span aria-hidden="true">/</span>
          {index === path.length - 1 ? (
            <span aria-current="page">{team.name}</span>
          ) : (
            <a href={href("team/" + team.id)}>{team.name}</a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
function PersonCard({ member }) {
  return (
    <a className="person-card" href={href("person/" + member.id)} data-reveal>
      <div className="portrait-frame">
        <MemberImage member={member} />
        <span>
          <Arrow diagonal />
        </span>
      </div>
      <h3>{member.name}</h3>
      <p>{member.role}</p>
    </a>
  );
}
function TeamDetail({ data, id }) {
  const team = data.teams.find((t) => t.id === id);
  if (!team) return <NotFound />;
  const members = teamMembers(data, id),
    cases = teamCases(data, id),
    children = childTeams(data.teams, id);
  return (
    <section className="wrap page-main">
      <TeamBreadcrumb data={data} id={id} />
      <div className="page-heading">
        <Label>{team.type}</Label>
        <Title lines={[team.name]} />
        <p className="team-description" data-enter>
          {team.description}
        </p>
      </div>
      {team.pending && (
        <p className="organization-pending-note">
          现有组织和成员资料已展示，详细介绍与新增作品将持续补充。
        </p>
      )}
      {children.length > 0 && (
        <section className="subgroup-overview">
          <Label>SUBGROUPS / 下属小组</Label>
          <div className="subgroup-grid">
            {children.map((child) => (
              <a href={href("team/" + child.id)} key={child.id}>
                <h2>
                  {child.name}
                  <Arrow diagonal />
                </h2>
                <p>{child.summary}</p>
                <span>{teamMembers(data, child.id).length} 位成员资料</span>
              </a>
            ))}
          </div>
        </section>
      )}
      <div className="team-detail-label">
        <Label>
          TEAM MEMBERS / {children.length ? "团队与下属小组成员" : "小组成员"}
        </Label>
        <span>{members.length} 位</span>
      </div>
      {members.length ? (
        <div className="people-grid all-people">
          {members.map((m) => (
            <PersonCard member={m} key={m.id} />
          ))}
        </div>
      ) : (
        <p className="empty-group">成员介绍正在整理。</p>
      )}
      {cases.length > 0 && (
        <section className="team-work">
          <div className="section-head">
            <h2>团队相关案例</h2>
            <span>{cases.length} 个案例</span>
          </div>
          <p className="project-context">
            用于了解团队业务范围，各成员的具体参与请查看个人介绍。
          </p>
          <div className="case-library">
            {cases.map((item, index) => (
              <CaseCard item={item} index={index} key={item.id} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
function Person({ data, id }) {
  const [showAllRelated, setShowAllRelated] = useState(false);
  const member = data.members.find((m) => m.id === id);
  if (!member) return <NotFound />;
  const isDirector = member.id === director(data)?.id,
    groups = memberTeamIds(member)
      .map((id) => data.teams.find((t) => t.id === id))
      .filter(Boolean),
    projects = memberProjects(data, member);
  return (
    <section className="wrap page-main">
      <a
        className="back-link"
        href={href(isDirector ? "teams" : "team/" + member.teamId)}
      >
        ← {isDirector ? "我们的团队" : groups[0]?.name || "我们的团队"}
      </a>
      <div className="person-detail">
        <div className="person-detail-photo" data-enter>
          <MemberImage member={member} />
        </div>
        <div>
          <Label>MEET THE TEAM</Label>
          <Title lines={[member.name]} />
          <h2>{member.role}</h2>
          {!isDirector && (
            <div className="person-memberships">
              {groups.map((group, index) => (
                <a href={href("team/" + group.id)} key={group.id}>
                  <span>{index ? "协作" : "所属"}</span>
                  {teamPath(data.teams, group.id)
                    .map((t) => t.name)
                    .join(" / ")}
                  <Arrow diagonal />
                </a>
              ))}
            </div>
          )}
          <p className="person-bio">{member.bio}</p>
          {member.experience && (
            <div className="experience">
              <Label>专业经历</Label>
              <p>{member.experience}</p>
            </div>
          )}
          <Source
            source={member.source}
            scope={
              member.experience
                ? "成员个人履历与部门案例分别记录；项目整体数据不等同于个人业绩。"
                : "根据现有组织与岗位资料介绍，详细履历和作品将持续补充。"
            }
          />
        </div>
      </div>
      {projects.personal.length > 0 && (
        <section className="member-projects personal-projects">
          <div className="section-head">
            <div>
              <Label>PROJECT EXPERIENCE</Label>
              <h2>个人资料中的相关项目</h2>
            </div>
            <span>{projects.personal.length} 个</span>
          </div>
          <p className="project-context">
            关联依据个人履历与项目分工整理，案例结果采用项目整体口径。
          </p>
          <div className="case-library">
            {projects.personal.map(({ item, description, source }, index) => (
              <div key={item.id}>
                <CaseCard item={item} index={index} />
                <p className="member-project-role">{description}</p>
                {source && (
                  <small className="member-project-source">
                    资料：{source.title}
                    {source.pages?.length
                      ? " · 第" + source.pages.join("、") + "页"
                      : ""}
                  </small>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {projects.related.length > 0 && (
        <section className="member-projects related-projects">
          <div className="section-head">
            <div>
              <Label>EXPLORE THE TEAM’S WORK</Label>
              <h2>{isDirector ? "部门" : "团队"}相关案例</h2>
            </div>
            {projects.related.length > 6 && (
              <button
                className="text-link"
                onClick={() => setShowAllRelated(!showAllRelated)}
              >
                {showAllRelated
                  ? "收起案例"
                  : `查看全部 ${projects.related.length} 个`}
                <Arrow diagonal />
              </button>
            )}
          </div>
          <p className="project-context">
            以下案例用于了解团队业务范围，个人参与以具体项目记录为准。
          </p>
          <div className="case-library">
            {projects.related
              .slice(0, showAllRelated ? undefined : 6)
              .map((item, index) => (
                <CaseCard item={item} index={index} key={item.id} />
              ))}
          </div>
        </section>
      )}
      {!projects.personal.length && !projects.related.length && (
        <div className="member-project-empty">
          <Label>PROJECTS</Label>
          <p>相关项目作品正在整理。</p>
          <a className="text-link" href={href("cases")}>
            浏览部门案例
            <Arrow diagonal />
          </a>
        </div>
      )}
    </section>
  );
}
export { Teams, TeamDetail, Person };
