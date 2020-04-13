import { ISentiment } from "../../../../models/ISentiment";

export interface ISentimentCommentDialogProps {
  sentiment: ISentiment;
  showCommentsDialog: boolean;
  onDismiss(): void;
  onSave(sentiment: ISentiment, comment: string): Promise<void>;
}
