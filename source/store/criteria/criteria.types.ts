import { List } from 'immutable';

export interface ICriteria {
  /*
  orphanmono: boolean;
  orphantwice: boolean;
  threechildren: boolean;
  manychildren: boolean;
  twins: boolean;
  disability: boolean;
  studies: boolean;
  income: string;
  */

  id: string;
  name: string;
  mutual_disabled_id: string,
  //globalIndex: number;
  selected: boolean;
}

export type ICriter = List<ICriteria>;
