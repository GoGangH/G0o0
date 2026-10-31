import Image from "next/image";
import Link from "next/link";
import { hashscape, phoneExperiences, phoneProject, projectsUsing, type PhoneExperience, type PhoneProject } from "@/data/apps";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";

export type PhonePost = { slug: string; title: string };
export type Screen =
  | { kind: "hashscape" }
  | { kind: "project"; id: string }
  | { kind: "experience"; id: string }
  | { kind: "skills" }
  | { kind: "skill"; name: string }
  | { kind: "about" };
type Open = (screen: Screen) => void;

type AppMark = { letter: string; tint: string; image?: string; inset?: boolean };

// A company's logo when there is one, otherwise its initial.
export function AppLogo({ letter, tint, image, inset }: AppMark) {
  if (!image) return <span className={`app-icon app-letter ${tint}`} aria-hidden="true"><span>{letter}</span></span>;
  return <span className={`app-icon app-logo ${tint}`} aria-hidden="true">
    <span className={inset ? "app-logo-image is-inset" : "app-logo-image"}><Image src={image} alt="" fill sizes="120px" unoptimized className="object-contain" /></span>
  </span>;
}

function Chevron() {
  return <svg aria-hidden="true" viewBox="0 0 8 14" className="row-chevron"><path d="m1 1 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function RowBody({ mark, title, sub }: { mark?: AppMark; title: string; sub?: string }) {
  return <>
    {mark && <span className="row-icon"><AppLogo {...mark} /></span>}
    <span className="row-text"><span className="row-title">{title}</span>{sub && <span className="row-sub">{sub}</span>}</span>
  </>;
}

function Hero({ name, position, period, ...mark }: AppMark & { name: string; position: string; period: string }) {
  return <header className="app-hero">
    <span className="app-hero-icon"><AppLogo {...mark} /></span>
    <div className="min-w-0">
      <h2 className="app-hero-name">{name}</h2>
      <p className="app-hero-sub">{position}</p>
      <p className="app-hero-sub font-mono">{period}</p>
    </div>
  </header>;
}

function HashscapeScreen({ open }: { open: Open }) {
  return <>
    <h2 className="app-large-title">{hashscape.name}</h2>
    <p className="app-section-label">프로젝트</p>
    <div className="app-card">
      {hashscape.projects.map(phoneProject).map((project) => <button key={project.id} type="button" className="app-row" onClick={() => open({ kind: "project", id: project.id })}>
        <RowBody mark={project} title={project.name} sub={project.period} />
        <Chevron />
      </button>)}
    </div>
  </>;
}

function ProjectScreen({ project, posts }: { project: PhoneProject; posts: PhonePost[] }) {
  const post = posts.find(({ slug }) => slug === project.postSlug);
  return <>
    <Hero name={project.name} position={project.position} period={project.period} letter={project.letter} tint={project.tint} image={project.image} inset={project.inset} />
    <dl className="app-metrics">
      {project.metrics.map(({ value, label }) => <div key={label}><dd>{value}</dd><dt>{label}</dt></div>)}
    </dl>
    <p className="app-section-label">어떤 서비스인가</p>
    <div className="app-card app-prose">{project.description}</div>
    <p className="app-section-label">내가 한 일</p>
    <div className="app-card">
      {project.sections.map(({ title, items }, index) => <details key={title} className="app-disclosure" open={index === 0}>
        <summary><span className="row-title">{title}</span><Chevron /></summary>
        <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      </details>)}
    </div>
    <p className="app-section-label">기술 스택</p>
    <div className="app-card app-prose">{project.tech.join(", ")}</div>
    {post && <>
      <p className="app-section-label">관련 글</p>
      <div className="app-card"><Link href={`/blog/${post.slug}`} className="app-row"><RowBody title={post.title} /><Chevron /></Link></div>
    </>}
  </>;
}

function ExperienceScreen({ experience }: { experience: PhoneExperience }) {
  return <>
    <Hero name={experience.name} position={experience.position} period={experience.period} letter={experience.letter} tint={experience.tint} image={experience.image} inset={experience.inset} />
    <p className="app-section-label">내가 한 일</p>
    <div className="app-card app-prose"><ul>{experience.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
  </>;
}

function SkillsScreen({ open }: { open: Open }) {
  return <>
    <h2 className="app-large-title">기술</h2>
    {skills.map(({ category, items }) => <section key={category}>
      <p className="app-section-label">{category}</p>
      <div className="app-card">
        {items.map((item) => {
          const count = projectsUsing(item).length;
          return count > 0
            ? <button key={item} type="button" className="app-row" onClick={() => open({ kind: "skill", name: item })}><RowBody title={item} /><span className="row-count">{count}</span><Chevron /></button>
            : <div key={item} className="app-row"><RowBody title={item} /></div>;
        })}
      </div>
    </section>)}
  </>;
}

function SkillScreen({ name, open }: { name: string; open: Open }) {
  return <>
    <h2 className="app-large-title">{name}</h2>
    <p className="app-section-label">사용한 프로젝트</p>
    <div className="app-card">
      {projectsUsing(name).map((project) => <button key={project.id} type="button" className="app-row" onClick={() => open({ kind: "project", id: project.id })}>
        <RowBody mark={project} title={project.name} sub={project.period} />
        <Chevron />
      </button>)}
    </div>
  </>;
}

function AboutScreen() {
  return <>
    <header className="contact-hero">
      <span className="contact-photo"><Image src="/info/profile.jpg" alt="" fill sizes="120px" className="object-cover" /></span>
      <h2 className="app-hero-name">{profile.nameKr}</h2>
      <p className="app-hero-sub">{profile.title}</p>
    </header>
    <p className="app-section-label">연락처</p>
    <div className="app-card">
      <a href={`mailto:${profile.email}`} className="app-row"><RowBody title="메일" sub={profile.email} /></a>
      <a href={profile.github} target="_blank" rel="noreferrer" className="app-row"><RowBody title="GitHub" sub="GoGangH" /></a>
      <a href={profile.linkedin} target="_blank" rel="noreferrer" className="app-row"><RowBody title="LinkedIn" /></a>
    </div>
    <p className="app-section-label">소개</p>
    <div className="app-card app-prose app-paragraphs">{profile.bio.slice(1).map((text) => <p key={text}>{text}</p>)}</div>
    <p className="app-section-label">학력</p>
    <div className="app-card app-prose">{profile.education}</div>
  </>;
}

export function screenTitle(screen: Screen) {
  switch (screen.kind) {
    case "hashscape": return hashscape.name;
    case "project": return phoneProject(screen.id).name;
    case "experience": return phoneExperiences.find(({ id }) => id === screen.id)!.label;
    case "skills": return "기술";
    case "skill": return screen.name;
    case "about": return "소개";
  }
}

export function PhoneScreen({ screen, open, posts }: { screen: Screen; open: Open; posts: PhonePost[] }) {
  switch (screen.kind) {
    case "hashscape": return <HashscapeScreen open={open} />;
    case "project": return <ProjectScreen project={phoneProject(screen.id)} posts={posts} />;
    case "experience": return <ExperienceScreen experience={phoneExperiences.find(({ id }) => id === screen.id)!} />;
    case "skills": return <SkillsScreen open={open} />;
    case "skill": return <SkillScreen name={screen.name} open={open} />;
    case "about": return <AboutScreen />;
  }
}
