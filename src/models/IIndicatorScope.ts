export interface IIndicatorScope {
  key: string;
  name: string;
  scopeType: ScopeType;
}

export enum ScopeType {
  Today,
  YesterDay,
  ThisWeek,
  ThisMonth,
  ThisYear
}
