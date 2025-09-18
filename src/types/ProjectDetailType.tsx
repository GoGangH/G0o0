import { CompanyEnum } from "./CompanyType";

interface ProjectDescription {
  id: number;
  title: string;
  description: string;
}

export interface ProjectDetailType {
  id: number;
  title: string;
  descriptions: ProjectDescription[];
  company: CompanyEnum;
  startAt: Date;
  endAt?: Date;
}
