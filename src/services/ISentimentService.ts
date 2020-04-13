import { ISentimentValue } from "../models/ISentimentValue";
import { IIndicatorResult } from "../models/IIndicatorResult";
import { ScopeType } from "../models/IIndicatorScope";


export interface ISentimentService {
  getMySentiment(): Promise<ISentimentValue>;
  createSentiment(value: number, comment: string): Promise<ISentimentValue>;
  updateSentiment(id: number, value: number, comment: string): Promise<ISentimentValue>;

  getIndicatorData(scopeType: ScopeType): Promise<IIndicatorResult>;
}
