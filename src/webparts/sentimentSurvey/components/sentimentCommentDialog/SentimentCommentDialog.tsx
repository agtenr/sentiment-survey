import * as React from "react";
import styles from "./SentimentCommentDialog.module.scss";
import { ISentimentCommentDialogProps } from "./ISentimentCommentDialogProps";
import { ISentimentCommentDialogState } from "./ISentimentCommentDialogState";
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { getDialogStyles } from "./ISentimentCommentDialogStyles";
import { ISentimentService } from "../../../../services/ISentimentService";
import { SentimentService } from "../../../../services/SentimentService";
import { ICategory } from "../../../../models/ICategory";
export class SentimentCommentDialog extends React.Component<ISentimentCommentDialogProps, ISentimentCommentDialogState> {

  constructor(props: ISentimentCommentDialogProps) {
    super(props);

    this.state = {
      commentText: "",
      categoryText: ""
    };
  }

  public render() {
    const options: IDropdownOption[] = this.props.categories.map((category: ICategory) => {
      return {
        key: category.ID,
        text: category.Title
      };
    });

    return (
      <Dialog
        styles={getDialogStyles}
        hidden={!this.props.showCommentsDialog}
        onDismiss={this.props.onDismiss}
        dialogContentProps={{
          type: DialogType.normal,
          title: "What makes you feel this way?"
        }}
        modalProps={{
          isBlocking: true
        }}
      >
        <TextField
          value={this.state.commentText}
          onChange={this._onTextChange}
        />
        <div className={styles.categoryText}>
          {this.props.commentDialogCategoryText}
        </div>
        <Dropdown
          placeholder="Select an option"
          options={options}
          onChange={(this._onDropdownChange)}
        />
        <div className={styles.helpText} dangerouslySetInnerHTML={{__html: this.props.commentDialogHelpHtml}}></div>
        <DialogFooter>
          <DefaultButton onClick={() => this.props.onSave(this.props.sentiment, "", "")} text="Skip" />
          <PrimaryButton onClick={() => this.props.onSave(this.props.sentiment, this.state.commentText, this.state.categoryText)} text="Save"/>
        </DialogFooter>
      </Dialog>
    );
  }

  private _onDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    this.setState({ categoryText: option ? option.text : ""});
  }
  private _onTextChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    this.setState({ commentText: newValue || "" });
  }
}
