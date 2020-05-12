import { ISentiment } from "../../../../models/ISentiment";
import { ICategory } from "../../../../models/ICategory";

export interface ISentimentCommentDialogProps {
  sentiment: ISentiment;
  showCommentsDialog: boolean;
  commentDialogCategoryText: string;
  commentDialogHelpHtml: string;
  categories: ICategory[];
  onDismiss(): void;
  onSave(sentiment: ISentiment, comment: string, category: string): Promise<void>;
}
