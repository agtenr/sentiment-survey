import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";

import { ISentimentService } from "./ISentimentService";
import { ISentimentValue } from "../models/ISentimentValue";

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
}
