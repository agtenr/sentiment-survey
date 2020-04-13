import { ISentiment } from "../../../../models/ISentiment";

export interface ISentimentSelectorProps {
  title: string;
  sentiments: ISentiment[];
  selectedSentiment: ISentiment;
  onUpdateSentiment(sentiment: ISentiment): Promise<void>;
}
