import * as React from "react";
import styles from "./SentimentSurvey.module.scss";
import { ISentimentSurveyProps } from "./ISentimentSurveyProps";
import { ISentimentSurveyState } from "./ISentimentSurveyState";
import { DisplayMode } from "@microsoft/sp-core-library";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";

import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { ISentimentService } from "../../../services/ISentimentService";
import { SentimentService } from "../../../services/SentimentService";
import { ISentimentValue } from "../../../models/ISentimentValue";

export default class SentimentSurvey extends React.Component<ISentimentSurveyProps, ISentimentSurveyState> {

  constructor(props: ISentimentSurveyProps) {
    super(props);

    this.state = {
      isLoading: true,
      myCurrentSentiment: undefined
    };
  }

  public componentDidMount() {
    this._initialLoad();
  }

  public render(): React.ReactElement<ISentimentSurveyProps> {

    // list id
    if (!this.props.listId) {
      if (this.props.displayMode === DisplayMode.Read) {
        return this._renderNoListId();
      } else {
        return this._renderPlaceHolder();
      }
    }

    if (this.state.isLoading) {
      return (
        <Spinner
          label={"Loading Sentiment Survey"}
          size={SpinnerSize.medium}
        />
      );
    }


    return (
      <div className={ styles.sentimentSurvey }>
        {this.state.myCurrentSentiment ? (
          <span>Show indicator</span>
        ) : (
          <span>Show questions</span>
        )}
      </div>
    );
  }

  private _initialLoad = async(): Promise<void> => {
    const sentimentSurvey: ISentimentService = new SentimentService(this.props.listId);
    const myCurrentSentiment: ISentimentValue = await sentimentSurvey.getMySentiment();

    this.setState({ isLoading: false, myCurrentSentiment });
  }

  private _renderNoListId = (): JSX.Element => {
    return (
      <MessageBar messageBarType={MessageBarType.warning}>
        {"Please select a list in the web part properties"}
      </MessageBar>
    );
  }
  private _renderPlaceHolder = (): JSX.Element => {
    return (
      <Placeholder
        iconName='Edit'
        iconText='Configure your web part'
        description='Please provide a list for the survey in the web part properties'
        buttonLabel='Configure'
        onConfigure={this.props.onConfigure} />
    );
  }
}
