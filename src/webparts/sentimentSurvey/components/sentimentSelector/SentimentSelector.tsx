import * as React from "react";
import styles from "../SentimentSurvey.module.scss";
import { ISentimentSelectorProps } from "./ISentimentSelectorProps";
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { ISentiment } from "../../../../models/ISentiment";

export const SentimentSelector: React.SFC<ISentimentSelectorProps> = (props: ISentimentSelectorProps) => {

  const options: IChoiceGroupOption[] = props.sentiments.map((s: ISentiment) => {
    return {
      key: s.key,
      text: s.name,
      iconProps: { iconName: s.iconName }
    };
  });

  const onSentimentChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption): void => {
    if (props.sentiments.some((s: ISentiment) => s.key === option.key)) {
      const sentiment: ISentiment = props.sentiments.filter((s: ISentiment) => s.key === option.key)[0];
      props.onUpdateSentiment(sentiment);
    }
  };

  let selectedKey: string = undefined;
  if (props.selectedSentiment && props.sentiments.some((s) => s.key === props.selectedSentiment.key)) {
    selectedKey = props.sentiments.filter((s) => s.key === props.selectedSentiment.key)[0].key;
  }

  return (
    <ChoiceGroup
      className={styles.sentimentSelector}
      label={props.title}
      options={options}
      selectedKey={selectedKey}
      onChange={onSentimentChange}
    />
  );
};
