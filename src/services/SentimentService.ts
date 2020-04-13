import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import { IItemAddResult, IItemUpdateResult } from "@pnp/sp/items";

import { ISentimentService } from "./ISentimentService";
import { ISentimentValue } from "../models/ISentimentValue";
import { IIndicatorResult } from "../models/IIndicatorResult";
import { IStreamResult } from "../models/IStreamResult";
import { ScopeType } from "../models/IIndicatorScope";

export class SentimentService implements ISentimentService {

  private surveyListId: string;

  constructor(surveyListId: string) {
    this.surveyListId = surveyListId;
  }
  public async getMySentiment(): Promise<ISentimentValue> {

    const result: ISentimentValue[] = await sp.web.lists.getById(this.surveyListId).getItemsByCAMLQuery({
      ViewXml:
        `<View>` +
          `<Query>` +
            `<Where>`+
              `<And>` +
                `<Eq>` +
                  `<FieldRef Name="Author"/>` +
                  `<Value Type='User'><UserID/></Value>` +
                `</Eq>` +
                `<Eq>` +
                  `<FieldRef Name="Created"/>` +
                  `<Value Type='DateTime'><Today /></Value>` +
                `</Eq>` +
              `</And>` +
            `</Where>` +
          `</Query>` +
        `</View>`,
    });

    if (result && result.length > 0) {
      return result[0];
    } else {
      return undefined;
    }
  }
  public async createSentiment(value: number, comment: string): Promise<ISentimentValue> {
    const result: IItemAddResult = await sp.web.lists.getById(this.surveyListId).items.add({
      sentimentSurveySentiment: value,
      sentimentSurveyComment: comment
    });

    return {
      ID: result.data.ID,
      sentimentSurveySentiment: result.data.sentimentSurveySentiment
    };
  }
  public async updateSentiment(id: number, value: number, comment: string): Promise<ISentimentValue> {

    const result: IItemUpdateResult = await sp.web.lists.getById(this.surveyListId).items.getById(id).update({
      sentimentSurveySentiment: value,
      sentimentSurveyComment: comment
    });

    return {
      ID: id,
      sentimentSurveySentiment: value
    };
  }

  public async getIndicatorData(scopeType: ScopeType): Promise<IIndicatorResult> {
    const scope: ScopeType = scopeType;
    const averageViewXml =
      `<View>` +
        `<ViewFields></ViewFields>` +
        `<RowLimit>1</RowLimit>` +
        `<Query>` +
          `<Where>` +
            `${this._getDateFilter(scope)}` +
          `</Where>` +
        `</Query>` +
        `<Aggregations>` +
          `<FieldRef Name="sentimentSurveySentiment" Type="AVG" />` +
        `</Aggregations>` +
      `</View>`;

    const countViewXml =
      `<View>` +
        `<ViewFields></ViewFields>` +
        `<RowLimit>1</RowLimit>` +
        `<Query>` +
          `<Where>` +
            `${this._getDateFilter(scope)}` +
          `</Where>` +
        `</Query>` +
        `<Aggregations>` +
          `<FieldRef Name="sentimentSurveySentiment" Type="COUNT" />` +
        `</Aggregations>` +
      `</View>`;


    const averageResult: IStreamResult = await sp.web.lists.getById(this.surveyListId).renderListDataAsStream({ ViewXml: averageViewXml});
    const countResult: IStreamResult = await sp.web.lists.getById(this.surveyListId).renderListDataAsStream({ ViewXml: countViewXml});

    let average = 0;
    let count = 0;

    if (averageResult && averageResult.Row && averageResult.Row.length > 0) {
      average = parseFloat(averageResult.Row[0]["sentimentSurveySentiment.AVG"]);
    }

    if (countResult && countResult.Row && countResult.Row.length > 0) {
      count = parseFloat(countResult.Row[0]["sentimentSurveySentiment.COUNT"]);
    }

    const result: IIndicatorResult = {
      average,
      count
    };

    return result;
  }

  private _getDateFilter = (scopeType: ScopeType): string => {
    let query: string = "";
    const dateField = "sentimentSurveyDate";
    const today: Date = new Date();
    switch (scopeType) {
      case ScopeType.Today:
        query =
          `<Eq>` +
            `<FieldRef Name="${dateField}"/>` +
            `<Value Type='DateTime'><Today /></Value>` +
          `</Eq>`;
          break;
      case ScopeType.YesterDay:
        query =
          `<Eq>` +
            `<FieldRef Name="${dateField}"/>` +
            `<Value Type='DateTime'><Today OffsetDays="-1"/></Value>` +
          `</Eq>`;
        break;
      case ScopeType.ThisWeek:
        query =
          `<Gt>` +
            `<FieldRef Name="${dateField}"/>` +
            `<Value Type='DateTime'><Today OffsetDays="-${today.getDay()}"/></Value>` +
          `</Gt>`;
        break;
      case ScopeType.ThisMonth:
        query =
          `<Gt>` +
            `<FieldRef Name="${dateField}"/>` +
            `<Value Type='DateTime'><Today OffsetDays="-${today.getDate()}"/></Value>` +
          `</Gt>`;
        break;
      case ScopeType.ThisYear:
        query =
          `<Gt>` +
            `<FieldRef Name="${dateField}"/>` +
            `<Value Type='DateTime'><Today OffsetDays="-${this._getDayOfYear()}"/></Value>` +
          `</Gt>`;
        break;
    }
    return query;
  }

  private _getDayOfYear = (): number => {
    const now: any = new Date();
    const start: any = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
  }
}
