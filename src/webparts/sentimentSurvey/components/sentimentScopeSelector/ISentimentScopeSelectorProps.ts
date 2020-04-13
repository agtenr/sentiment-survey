import { IIndicatorScope } from "../../../../models/IIndicatorScope";

export interface ISentimentScopeSelectorProps {
  scopes: IIndicatorScope[];
  selectedScope: IIndicatorScope;
  onScopeChange(newScope: IIndicatorScope): Promise<void>;
}
