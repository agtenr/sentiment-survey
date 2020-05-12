import { DisplayMode } from "@microsoft/sp-core-library";
export interface ISentimentSurveyProps {
  displayMode: DisplayMode;
  title: string;
  listId: string;
  categoryListId: string;
  userLogin: string;
  surveyTitle: string;
  indicatorTitle: string;
  commentDialogCategoryText: string;
  commentDialogHelpHtml: string;
  onConfigure(): void;
  updateProperty(value: string): void;
}
