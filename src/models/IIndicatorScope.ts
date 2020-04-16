export interface IIndicatorScope {
  key: string;
  name: string;
  indicatorText: string;
  scopeType: ScopeType;
}

export enum ScopeType {
  Today,
  YesterDay,
  ThisWeek,
  ThisMonth,
  ThisYear
}
