import { IIndicatorResult } from "../../../../models/IIndicatorResult";
import { ISentiment } from "../../../../models/ISentiment";
import { IIndicatorScope } from "../../../../models/IIndicatorScope";

export interface ISentimentIndicatorProps {
  indicatorValue: IIndicatorResult;
  sentiments: ISentiment[];
  selectedScope: IIndicatorScope;
}
