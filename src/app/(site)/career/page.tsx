import { PageHeading } from "@/components/site/PageHeading";
import { career } from "@/data/career";
import { skills } from "@/data/skills";

const orderedCareer = [...career].sort((a, b) => b.period.localeCompare(a.period));

export default function CareerPage() {
  return (
    <div className="site-width site-page">
      <PageHeading title="경험" object="frame" />
      <div className="grid items-start gap-14 lg:grid-cols-[1fr_230px] lg:gap-16">
        <section aria-label="경력 및 활동" className="border-t border-rule">
          {orderedCareer.map((item) => <article key={item.id} className="border-b border-rule py-7">
            <p className="font-mono text-xs text-muted">{item.period}</p>
            <h2 className="mt-3 text-xl font-medium tracking-tight">{item.company}</h2>
            <p className="mt-2 text-sm text-muted">{item.position}</p>
            <ul className="site-details mt-5 text-sm leading-7">{item.description.map((text) => <li key={text}>{text}</li>)}</ul>
          </article>)}
        </section>
        <aside className="border-t border-rule pt-6">
          <h2 className="text-lg font-medium">사용 기술</h2>
          <dl className="mt-7 space-y-7">{skills.map((skill) => <div key={skill.category}>
            <dt className="text-sm font-medium">{skill.category}</dt>
            <dd className="mt-2 text-sm leading-7 text-muted">{skill.items.join(", ")}</dd>
          </div>)}</dl>
        </aside>
      </div>
    </div>
  );
}
