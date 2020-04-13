import { ISentimentValue } from "../models/ISentimentValue";
import { IIndicatorResult } from "../models/IIndicatorResult";

export interface ISentimentService {
  getMySentiment(): Promise<ISentimentValue>;
  createSentiment(value: number, comment: string): Promise<ISentimentValue>;
  updateSentiment(id: number, value: number, comment: string): Promise<ISentimentValue>;

  getIndicatorData(): Promise<IIndicatorResult>;
}
