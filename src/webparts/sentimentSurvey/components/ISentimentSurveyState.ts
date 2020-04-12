import { ISentimentValue } from "../../../models/ISentimentValue";

export interface ISentimentSurveyState {
  isLoading: boolean;
  myCurrentSentiment: ISentimentValue;
}
