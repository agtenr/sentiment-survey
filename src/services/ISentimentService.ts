import { ISentimentValue } from "../models/ISentimentValue";
import { IIndicatorResult } from "../models/IIndicatorResult";
import { ScopeType } from "../models/IIndicatorScope";
import { ICategory } from "../models/ICategory";


export interface ISentimentService {
  getMySentiment(): Promise<ISentimentValue>;
  createSentiment(value: number, comment: string, category: string): Promise<ISentimentValue>;
  updateSentiment(id: number, value: number, comment: string, category: string): Promise<ISentimentValue>;
  getIndicatorData(scopeType: ScopeType): Promise<IIndicatorResult>;
  getCategories(categoryListId: string): Promise<ICategory[]>;
}
