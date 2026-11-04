import { PageHeading } from "@/components/site/PageHeading";
import { career, careerGroups, careerSummary, type CareerItem } from "@/data/career";
import { skills } from "@/data/skills";

// Same order and wording as the resume: 경력, then 활동. Products of one company sit under it.
type Block = { org: string; period: string; items: CareerItem[] };
const blocksOf = (kind: CareerItem["kind"]) => career.filter((item) => item.kind === kind).reduce<Block[]>((blocks, item) => {
  const last = blocks[blocks.length - 1];
  if (careerGroups[item.org] && last?.org === item.org) last.items.push(item);
  else blocks.push({ org: item.org, period: careerGroups[item.org]?.period ?? item.period, items: [item] });
  return blocks;
}, []);

function Entry({ item, nested, own }: { item: CareerItem; nested: boolean; own: boolean }) {
  return <div id={item.id} className={nested ? "mt-7 scroll-mt-24 border-l border-rule pl-5" : "scroll-mt-24"}>
    {nested && <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 className="text-lg font-medium tracking-tight">{item.name}{item.summary && <span className="ml-2 text-sm font-normal text-muted">{item.summary}</span>}</h3>
      {own && <p className="font-mono text-xs text-muted">{item.period}</p>}
    </div>}
    <p className="mt-2 text-sm text-muted">
      {item.position}
      {item.link && <> · <a className="site-link text-accent" href={item.link.url}>{item.link.label}</a></>}
    </p>
    {item.tech.length > 0 && <p className="mt-1 text-xs leading-6 text-muted">{item.tech.join(", ")}</p>}
    <div className="mt-4 space-y-4 text-sm leading-7">
      {item.sections.map((section) => section.items.length === 1
        ? <p key={section.title}><strong className="font-semibold">{section.title}</strong> <span className="text-muted">·</span> {section.items[0]}</p>
        : <div key={section.title}>
          <p className="font-semibold">{section.title}</p>
          <ul className="site-details">{section.items.map((text) => <li key={text}>{text}</li>)}</ul>
        </div>)}
    </div>
    {item.highlight && <p className="mt-5 rounded-md border border-rule px-4 py-3 text-sm font-medium">✓ {item.highlight}</p>}
  </div>;
}

function Blocks({ kind }: { kind: CareerItem["kind"] }) {
  return <div className="border-t border-rule">
    {blocksOf(kind).map((block) => {
      const nested = block.items.length > 1 || Boolean(block.items[0].name);
      const only = block.items[0];
      return <article key={block.org + block.period} id={nested ? undefined : only.id} className="scroll-mt-24 border-b border-rule py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-xl font-medium tracking-tight">{block.org}{!nested && only.summary && <span className="ml-2 text-sm font-normal text-muted">{only.summary}</span>}</h2>
          <p className="font-mono text-xs text-muted">{block.period}</p>
        </div>
        {block.items.map((item) => <Entry key={item.id} item={item} nested={nested} own={block.items.length > 1} />)}
      </article>;
    })}
  </div>;
}

export default function CareerPage() {
  return (
    <div className="site-width site-page">
      <PageHeading title="경험" object="frame" />
      <div className="grid items-start gap-14 lg:grid-cols-[1fr_230px] lg:gap-16">
        <div className="min-w-0 space-y-14">
          <section aria-labelledby="work-title">
            <h2 id="work-title" className="mb-5 flex items-baseline gap-3 text-lg font-medium">경력 <span className="text-sm font-normal text-muted">{careerSummary}</span></h2>
            <Blocks kind="work" />
          </section>
          <section aria-labelledby="activity-title">
            <h2 id="activity-title" className="mb-5 text-lg font-medium">활동</h2>
            <Blocks kind="activity" />
          </section>
        </div>
        <aside className="border-t border-rule pt-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-medium">기술</h2>
          <dl className="mt-7 space-y-7">{skills.map((skill) => <div key={skill.category}>
            <dt className="text-sm font-medium">{skill.category}</dt>
            <dd className="mt-2 text-sm leading-7 text-muted">{skill.items.join(", ")}</dd>
          </div>)}</dl>
        </aside>
      </div>
    </div>
  );
}
