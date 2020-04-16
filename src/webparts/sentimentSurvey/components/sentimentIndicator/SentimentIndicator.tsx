import * as React from "react";
import styles from "./SentimentIndicator.module.scss";
import GaugeChart from "react-gauge-chart";
import { ISentimentIndicatorProps } from "./ISentimentIndicatorProps";
import { ISentiment } from "../../../../models/ISentiment";
import { Icon } from "office-ui-fabric-react/lib/Icon";

export const SentimentIndicator: React.SFC<ISentimentIndicatorProps> = (props: ISentimentIndicatorProps) => {
  // Set sentiment to highest value
  let selectedSentiment: ISentiment = props.sentiments[props.sentiments.length - 1];
  props.sentiments.every((s: ISentiment) => {
    if (props.indicatorValue.average <= s.value) {
      selectedSentiment = s;
      return false;
    }
    return true;
  });


  return (
    <div className={styles.sentimentIndicator}>
      <div className={styles.indicator}>
        {props.sentiments.map((s: ISentiment) => {
          return (
            <Icon iconName={s.iconName} style={{ left: s.iconPositionLeft, top: s.iconPositionTop }} />
          );
        })}
        <GaugeChart
          id="sentiementIndicator"
          nrOfLevels={5}
          colors={props.sentiments.map((s) => s.color)}
          hideText={true}
          arcPadding={0}
          cornerRadius={0}
          arcWidth={0.2}
          animDelay={0}
          percent={props.indicatorValue.average / 100}
        />
      </div>

      <div className={styles.info}>
        <span>{props.selectedScope.indicatorText}</span>
        <div>
          <strong>{selectedSentiment.name}</strong>
        </div>
      </div>

      <div className={styles.count}>
        {`(${props.indicatorValue.count} delawarians have answered)`}
      </div>
    </div>
  );
};
