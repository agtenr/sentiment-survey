import { ISentimentValue } from "../../../models/ISentimentValue";
import { ISentiment } from "../../../models/ISentiment";
import { IIndicatorScope } from "../../../models/IIndicatorScope";
import { IIndicatorResult } from "../../../models/IIndicatorResult";
import { ICategory } from "../../../models/ICategory";

export interface ISentimentSurveyState {
  isLoading: boolean;
  isUpdatingSentiment: boolean;
  showCommentsDialog: boolean;
  showSentimentSelector: boolean;
  showSentimentIndicator: boolean;
  myCurrentSentiment: ISentimentValue;
  selectedSentiment: ISentiment;
  selectedScope: IIndicatorScope;
  indicatorValue: IIndicatorResult;
  categories: ICategory[];
}
