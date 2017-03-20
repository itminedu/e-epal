import { List } from 'immutable';

export interface ICriteria {
  id: string;
  name: string;
  mutual_disabled_id: string,
  selected: boolean;
}

export type ICriter = List<ICriteria>;
