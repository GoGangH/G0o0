import Link from "next/link";
import { PageHeading } from "@/components/site/PageHeading";
import { career, careerTitle } from "@/data/career";
import { projects } from "@/data/projects";

// Work products are told in full on the career page; here they get a short card that points there.
const workProducts = career.filter((item) => item.kind === "work" ? item.id !== "inspien" : Boolean(item.name));

export default function ProjectsPage() {
  return (
    <section className="site-width site-page">
      <PageHeading title="프로젝트" object="drawer" />
      <h2 className="mb-5 text-lg font-medium">개인 프로젝트</h2>
      <div className="border-t border-rule">
        {projects.map((project) => (
          <article key={project.id} className="grid gap-4 border-b border-rule py-8 md:grid-cols-[180px_1fr] md:gap-10 md:py-10">
            <p className="pt-1 font-mono text-xs leading-6 text-muted">{project.type}</p>
            <div className="min-w-0">
              <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{project.name}<span className="ml-3 text-base font-normal text-muted">{project.description}</span></h3>
              <ul className="site-details mt-4 text-sm leading-7">{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
              <p className="mt-5 text-xs leading-6 text-muted"><span className="mr-3">사용 기술</span>{project.tech.join(", ")}</p>
              {project.links && <div className="mt-3 flex flex-wrap gap-5 text-sm">{project.links.map((link) => <a key={link.url} className="site-link text-accent" href={link.url}>{link.label}</a>)}</div>}
            </div>
          </article>
        ))}
      </div>

      <h2 className="mb-5 mt-16 text-lg font-medium">경력·활동에서 만든 서비스</h2>
      <div className="grid gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-2">
        {workProducts.map((item) => <Link key={item.id} href={`/career#${item.id}`} className="group block bg-background p-6 transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_4%,var(--background))]">
          <p className="font-mono text-xs text-muted">{item.period}</p>
          <h3 className="mt-2 text-lg font-medium tracking-tight">{careerTitle(item)}</h3>
          {item.summary && <p className="mt-1 text-sm text-muted">{item.summary}</p>}
          <p className="mt-4 text-xs leading-6 text-muted">{item.tech.join(", ")}</p>
          <p className="mt-4 text-sm text-accent">자세히 보기 <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">→</span></p>
        </Link>)}
      </div>
    </section>
  );
}
