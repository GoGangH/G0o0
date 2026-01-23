export interface Award {
  id: number;
  title: string;
  organization: string;
  prize: string;
}

export const awards: Award[] = [
  {
    id: 1,
    title: "알고리즘 대회",
    organization: "국민대학교",
    prize: "장려상",
  },
  {
    id: 2,
    title: "ICT 창의성 대회",
    organization: "ICT",
    prize: "금상",
  },
];
