import { List } from 'immutable';

export interface ICriteria {
  id: string;
  name: string;
  category: string;
  mutual_disabled_id: string;
  points: string;
  selected: boolean;
}

export type ICriter = List<ICriteria>;
