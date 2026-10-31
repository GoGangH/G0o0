import { PageHeading } from "@/components/site/PageHeading";
import { projects } from "@/data/projects";

const orderedProjects = [...projects].sort((a, b) => b.period.localeCompare(a.period));

export default function ProjectsPage() {
  return (
    <section className="site-width site-page">
      <PageHeading title="프로젝트" object="drawer" />
      <div className="border-t border-rule">
        {orderedProjects.map((project) => (
          <article key={project.id} className="grid gap-4 border-b border-rule py-8 md:grid-cols-[180px_1fr] md:gap-10 md:py-10">
            <p className="pt-1 font-mono text-xs leading-6 text-muted">{project.period}</p>
            <div className="min-w-0">
              <h2 className="text-xl font-medium tracking-tight sm:text-2xl">{project.name}</h2>
              <p className="mt-3 text-[15px] leading-7 text-muted">{project.description}</p>
              <ul className="site-details mt-5 text-sm leading-7">{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
              <p className="mt-6 text-xs leading-6 text-muted"><span className="mr-3">사용 기술</span>{project.tech.join(", ")}</p>
              {project.links && <div className="mt-4 flex flex-wrap gap-5 text-sm">{project.links.map((link) => <a key={link.url} className="site-link text-accent" href={link.url}>{link.label}</a>)}</div>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
