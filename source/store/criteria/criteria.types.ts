import { List } from 'immutable';

export interface ICriteria {
  orphanmono: boolean;
  orphantwice: boolean;
  threechildren: boolean;
  manychildren: boolean;
  twins: boolean;
  disability: boolean;
  studies: boolean;
  income: string;
}

export type ICriter = List<ICriteria>;
