import * as React from "react";
import styles from "./SentimentSurvey.module.scss";
import { ISentimentSurveyProps } from "./ISentimentSurveyProps";
import { ISentimentSurveyState } from "./ISentimentSurveyState";
import { DisplayMode } from "@microsoft/sp-core-library";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

import { Label } from "office-ui-fabric-react/lib/Label";
import { Link } from "office-ui-fabric-react/lib/Link";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import { ISentimentValue } from "../../../models/ISentimentValue";
import { ISentiment } from "../../../models/ISentiment";
import { IIndicatorScope, ScopeType } from "../../../models/IIndicatorScope";
import { IIndicatorResult } from "../../../models/IIndicatorResult";

import { ISentimentService } from "../../../services/ISentimentService";
import { SentimentService } from "../../../services/SentimentService";

import { SentimentCommentDialog } from "./sentimentCommentDialog/SentimentCommentDialog";
import { SentimentIndicator } from "./sentimentIndicator/SentimentIndicator";
import { SentimentScopeSelector } from "./sentimentScopeSelector/SentimentScopeSelector";
import { SentimentSelector } from "./sentimentSelector/SentimentSelector";

import "@pnp/polyfill-ie11";
import 'core-js/fn/array/from';
import 'core-js/fn/number/is-finite';
import 'core-js/fn/reflect';
import 'core-js/fn/symbol';
import 'core-js/es6/symbol';
import 'core-js/fn/array/from';
import 'core-js/fn/number/is-finite';
import 'core-js/fn/reflect';
import 'core-js/fn/symbol/iterator.js';
import 'core-js/es7/reflect';
import 'core-js/es6/reflect';

export default class SentimentSurvey extends React.Component<ISentimentSurveyProps, ISentimentSurveyState> {

  constructor(props: ISentimentSurveyProps) {
    super(props);

    this.state = {
      isLoading: true,
      isUpdatingSentiment: false,
      showCommentsDialog: false,
      showSentimentSelector: false,
      showSentimentIndicator: true,
      myCurrentSentiment: undefined,
      selectedSentiment: undefined,
      selectedScope: this._getScopes()[0],
      indicatorValue: undefined
    };
  }

  public componentDidMount() {
    if (this.props.listId) {
      this._initialLoad();
    }
  }

  public componentDidUpdate(prevProps: ISentimentSurveyProps) {
    if (this.props.listId !== prevProps.listId) {
      this._initialLoad();
    }
  }

  public render(): React.ReactElement<ISentimentSurveyProps> {

    // Check if list id is provided
    if (!this.props.listId) {
      if (this.props.displayMode === DisplayMode.Read) {
        return this._renderNoListId();
      } else {
        return this._renderPlaceHolder();
      }
    }

    if (this.state.isLoading) {
      return (
        <div>
          {this._renderTitle()}
          <Spinner
            label={"Loading Sentiment Survey"}
            size={SpinnerSize.medium}
          />
        </div>
      );
    }

    if (this.state.isUpdatingSentiment) {
      return (
        <div>
          {this._renderTitle()}
          <Spinner
            label={"Updating your sentiment..."}
            size={SpinnerSize.medium}
          />
        </div>
      );
    }


    return (
      <div className={styles.sentimentSurvey}>
        <WebPartTitle
          displayMode={this.props.displayMode}
          title={this.props.title}
          updateProperty={this.props.updateProperty}
        />
        <div>
          {this.state.showSentimentSelector && (
            <SentimentSelector
              sentiments={this._getSentiments()}
              selectedSentiment={this.state.selectedSentiment}
              title={this.props.surveyTitle}
              onUpdateSentiment={this._onUpdateSentiment}
            />
          )}
          {this.state.showSentimentIndicator && (
            <div>
              <Label className={styles.indicatorTitle}>{this.props.indicatorTitle}</Label>
              <SentimentScopeSelector scopes={this._getScopes()} selectedScope={this.state.selectedScope} onScopeChange={this._onUpdateScope}/>
              <SentimentIndicator selectedScope={this.state.selectedScope} indicatorValue={this.state.indicatorValue} sentiments={this._getSentiments()}/>
              {this.state.myCurrentSentiment && (
                <div className={styles.changeLink}>
                  <Link onClick={this._onShowSentimentSelector}>Change my sentiment</Link>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <SentimentCommentDialog
            sentiment={this.state.selectedSentiment}
            showCommentsDialog={this.state.showCommentsDialog}
            onDismiss={this._closeDialog}
            onSave={this._onUpdateSentimentWithComment}
          />
        </div>
      </div>
    );
  }

  private _initialLoad = async (): Promise<void> => {
    const sentimentSurvey: ISentimentService = new SentimentService(this.props.listId);
    const myCurrentSentiment: ISentimentValue = await sentimentSurvey.getMySentiment();
    const indicatorValue = await this._getInitcatorData();
    this.setState({
      myCurrentSentiment,
      indicatorValue,
      isLoading: false,
      showSentimentSelector: !myCurrentSentiment
    });
    // this.setState({ myCurrentSentiment }, async () => {
    //   if (myCurrentSentiment) {
    //     const indicatorValue = await this._getInitcatorData();
    //     this.setState({
    //       indicatorValue,
    //       isLoading: false
    //     });
    //   } else {
    //     this.setState({ isLoading: false });
    //   }
    // });
  }
  private _getInitcatorData = async (): Promise<IIndicatorResult> => {
    const sentimentSurvey: ISentimentService = new SentimentService(this.props.listId);
    const indicatorResult = await sentimentSurvey.getIndicatorData(this.state.selectedScope.scopeType);
    return indicatorResult;
  }

  private _onUpdateSentiment = async (sentiment: ISentiment): Promise<void> => {
    const sentimentSurvey: ISentimentService = new SentimentService(this.props.listId);
    if (sentiment.needsExplanation) {
      // Requires explanation
      this.setState({ showCommentsDialog: true, selectedSentiment: sentiment });
    } else {
      this.setState({ isUpdatingSentiment: true});
      if (this.state.myCurrentSentiment) {
        // Update current sentitment
        const newSentiment: ISentimentValue = await sentimentSurvey.updateSentiment(this.state.myCurrentSentiment.ID, sentiment.value, "");
        const indicatorValue = await this._getInitcatorData();
        this.setState({
          isUpdatingSentiment: false,
          myCurrentSentiment: newSentiment,
          showSentimentSelector: !newSentiment,
          showSentimentIndicator: true,
          indicatorValue
        });
      } else {
        // Craete new sentiment
        const newSentiment: ISentimentValue = await sentimentSurvey.createSentiment(sentiment.value, "");
        const indicatorValue = await this._getInitcatorData();
        this.setState({
          isUpdatingSentiment: false,
          myCurrentSentiment: newSentiment,
          showSentimentSelector: !newSentiment,
          showSentimentIndicator: true,
          indicatorValue
        });
      }
    }
  }
  private _onUpdateSentimentWithComment = async (sentiment: ISentiment, comment: string): Promise<void> => {
    this.setState({ isUpdatingSentiment: true, showCommentsDialog: false});
    const sentimentSurvey: ISentimentService = new SentimentService(this.props.listId);
    if (this.state.myCurrentSentiment) {
      // Update current sentitment
      const newSentiment: ISentimentValue = await sentimentSurvey.updateSentiment(this.state.myCurrentSentiment.ID, sentiment.value, comment);
      const indicatorValue = await this._getInitcatorData();
      this.setState({
        isUpdatingSentiment: false,
        myCurrentSentiment: newSentiment,
        showSentimentSelector: !newSentiment,
        showSentimentIndicator: true,
        indicatorValue
      });
    } else {
      // Craete new sentiment

      const newSentiment: ISentimentValue = await sentimentSurvey.createSentiment(sentiment.value, comment);
      const indicatorValue = await this._getInitcatorData();
      this.setState({
        isUpdatingSentiment: false,
        myCurrentSentiment: newSentiment,
        showSentimentSelector: !newSentiment,
        showSentimentIndicator: true,
        indicatorValue
      });
    }

  }

  private _onUpdateScope = async (newScope: IIndicatorScope): Promise<void> => {
    this.setState({
      isLoading: true,
      selectedScope: newScope
    }, async () => {

      const indicatorValue = await this._getInitcatorData();
      this.setState({ indicatorValue, isLoading: false });
    });
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
  private _renderTitle = (): JSX.Element => {
    return (
      <WebPartTitle
        displayMode={this.props.displayMode}
        title={this.props.title}
        updateProperty={this.props.updateProperty}
      />
    );
  }
  private _closeDialog = (): void => {
    this.setState({
      isUpdatingSentiment: false,
      showCommentsDialog: false,
      selectedSentiment: undefined
    });
  }
  private _onShowSentimentSelector = (): void => {
    const sentiments = this._getSentiments();
    if (sentiments.some((s) => s.value === this.state.myCurrentSentiment.sentimentSurveySentiment)) {
      const selectedSentiment = sentiments.filter((s) => s.value === this.state.myCurrentSentiment.sentimentSurveySentiment)[0];
      this.setState({ showSentimentSelector: true, showSentimentIndicator: false, selectedSentiment });
    }
  }

  private _getSentiments = (): ISentiment[] => {
    return [
      {
        key: "1",
        name: "I can't handle this!",
        value: 20,
        iconName: "EmojiDisappointed",
        needsExplanation: true,
        color: "#f00",
        iconPositionLeft: "8%",
        iconPositionTop: "60%"
      },
      {
        key: "2",
        name: "I've felt better",
        value: 40,
        iconName: "Sad",
        needsExplanation: true,
        color: "#ff8000",
        iconPositionLeft: "20%",
        iconPositionTop: "20%"
      },
      {
        key: "3",
        name: "Okay, I guess..",
        value: 60,
        iconName: "EmojiNeutral",
        needsExplanation: false,
        color: "#ff0",
        iconPositionLeft: "calc(50% - 12px)",
        iconPositionTop: "0"
      },
      {
        key: "4",
        name: "Pretty good!",
        value: 80,
        iconName: "Emoji2",
        needsExplanation: false,
        color: "#80ff00",
        iconPositionLeft: "calc(80% - 24px)",
        iconPositionTop: "20%"
      },
      {
        key: "5",
        name: "Awesome",
        value: 100,
        iconName: "Emoji",
        needsExplanation: false,
        color: "#0f0",
        iconPositionLeft: "calc(92% - 24px)",
        iconPositionTop: "60%"
      },
    ];
  }
  private _getScopes = (): IIndicatorScope[] => {
    return [
      { scopeType: ScopeType.Today, key: "today", name: "Today", indicatorText: "Today the people of delaware are feeling:" },
      { scopeType: ScopeType.YesterDay, key: "yesterday", name: "Yesterday", indicatorText: "Yesterday the people of delaware were feeling:" },
      { scopeType: ScopeType.ThisWeek, key: "thisWeek", name: "This week", indicatorText: "This week the people of delaware are feeling:" },
      { scopeType: ScopeType.ThisMonth, key: "thisMonth", name: "This month", indicatorText: "This month the people of delaware are feeling:" },
      { scopeType: ScopeType.ThisYear, key: "thisYeas", name: "This year", indicatorText: "This year the people of delaware are feeling:" },
    ];
  }
}
