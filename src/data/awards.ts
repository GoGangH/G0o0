export interface Award {
  id: number;
  title: string;
  organization: string;
  prize: string;
}

export const awards: Award[] = [
  {
    id: 1,
    title: "ICT 창의성 대회",
    organization: "ICT · 2018.08",
    prize: "은상",
  },
  {
    id: 2,
    title: "국민대학교 알고리즘 대회",
    organization: "국민대학교 · 2018.08",
    prize: "장려상",
  },
];
