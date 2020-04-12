import { DisplayMode } from "@microsoft/sp-core-library";
export interface ISentimentSurveyProps {
  displayMode: DisplayMode;
  listId: string;
  userLogin: string;
  onConfigure(): void;
}
