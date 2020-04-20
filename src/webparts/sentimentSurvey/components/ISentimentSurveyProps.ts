import { DisplayMode } from "@microsoft/sp-core-library";
export interface ISentimentSurveyProps {
  displayMode: DisplayMode;
  title: string;
  listId: string;
  userLogin: string;
  surveyTitle: string;
  indicatorTitle: string;
  onConfigure(): void;
  updateProperty(value: string): void;
}
