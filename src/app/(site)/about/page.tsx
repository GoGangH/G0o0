import { RoomObject } from "@/components/site/RoomObject";
import { profile } from "@/data/profile";

export default function AboutPage() {
  return (
    <div className="site-width site-page">
      <div className="grid gap-10 md:grid-cols-[220px_1fr] md:gap-16">
        <header>
          <h1 className="site-title">{profile.nameKr}</h1>
          <p className="mt-3 text-sm text-muted">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">{profile.title}</p>
          <div className="mt-8 hidden md:block"><RoomObject group="monitor" /></div>
        </header>
        <div className="max-w-[660px]">
          <div className="space-y-6 text-[16px] leading-[1.95] sm:text-[17px]">
            {profile.bio.slice(1).map((text) => <p key={text}>{text}</p>)}
          </div>
          <dl className="mt-10 grid gap-3 border-t border-rule pt-6 text-sm leading-7 sm:grid-cols-[64px_1fr]">
            <dt className="text-muted">학력</dt><dd>{profile.education}</dd>
          </dl>
          <section className="mt-12 border-t border-rule pt-6" aria-labelledby="contact-title">
            <h2 id="contact-title" className="font-sans text-sm text-muted">연락처</h2>
            <a className="site-link mt-4 inline-block break-all text-base" href={`mailto:${profile.email}`}>{profile.email}</a>
            <div className="mt-4 flex gap-6 text-sm">
              <a className="site-link" href={profile.github}>GitHub</a>
              <a className="site-link" href={profile.linkedin}>LinkedIn</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
