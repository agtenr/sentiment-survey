import * as React from "react";
import { ISentimentCommentDialogProps } from "./ISentimentCommentDialogProps";
import { ISentimentCommentDialogState } from "./ISentimentCommentDialogState";
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from "office-ui-fabric-react/lib/TextField";

export class SentimentCommentDialog extends React.Component<ISentimentCommentDialogProps, ISentimentCommentDialogState> {

  constructor(props: ISentimentCommentDialogProps) {
    super(props);

    this.state = {
      commentText: ""
    };
  }

  public render() {
    return (
      <Dialog
        hidden={!this.props.showCommentsDialog}
        onDismiss={this.props.onDismiss}
        dialogContentProps={{
          type: DialogType.normal,
          title: "What makes you feel this way?"
        }}
        modalProps={{
          isBlocking: true,
        }}
      >
        <TextField
          value={this.state.commentText}
          onChange={this._onTextChange}
        />
        <DialogFooter>
          <DefaultButton onClick={() => this.props.onSave(this.props.sentiment, "")} text="Skip" />
          <PrimaryButton onClick={() => this.props.onSave(this.props.sentiment, this.state.commentText)} text="Save"/>
        </DialogFooter>
      </Dialog>
    );
  }

  private _onTextChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    this.setState({ commentText: newValue || "" });
  }
}
