import { ISentimentValue } from "../models/ISentimentValue";

export interface ISentimentService {
  getMySentiment(): Promise<ISentimentValue>;
}
