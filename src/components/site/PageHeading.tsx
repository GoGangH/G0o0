import { RoomObject } from "./RoomObject";

export function PageHeading({ title, object, children }: { title: string; object: string; children?: React.ReactNode }) {
  return <div className="mb-10 flex items-end justify-between gap-8">
    <div className="min-w-0">
      <h1 className="site-title">{title}</h1>
      {children}
    </div>
    <RoomObject group={object} />
  </div>;
}
