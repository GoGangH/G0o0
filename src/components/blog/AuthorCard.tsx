import Image from "next/image";
import Link from "next/link";
import { profile } from "@/data/profile";

export function AuthorCard() {
  return <div className="flex items-center gap-3.5">
    <span className="relative block h-14 w-14 flex-none overflow-hidden rounded-full"><Image src="/info/profile.jpg" alt="" fill sizes="56px" className="object-cover" /></span>
    <div className="min-w-0">
      <Link href="/about" className="site-link font-bold">{profile.nameKr}</Link>
      <p className="mt-0.5 text-sm text-muted">{profile.title}</p>
    </div>
  </div>;
}
