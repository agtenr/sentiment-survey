import { IIndicatorResult } from "../../../../models/IIndicatorResult";
import { ISentiment } from "../../../../models/ISentiment";

export interface ISentimentIndicatorProps {
  indicatorValue: IIndicatorResult;
  sentiments: ISentiment[];
}
