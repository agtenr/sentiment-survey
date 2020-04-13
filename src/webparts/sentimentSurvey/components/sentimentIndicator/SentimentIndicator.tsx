import * as React from "react";
import styles from "./SentimentIndicator.module.scss";
import GaugeChart from "react-gauge-chart";
import { ISentimentIndicatorProps } from "./ISentimentIndicatorProps";
import { ISentiment } from "../../../../models/ISentiment";

export const SentimentIndicator: React.SFC<ISentimentIndicatorProps> = (props: ISentimentIndicatorProps) => {

  const getSentimentName = (): string => {
    // Set sentiment to highest value
    let sentiment: string = props.sentiments[props.sentiments.length - 1].name;
    props.sentiments.every((s: ISentiment) => {
      if (props.indicatorValue.average <= s.value) {
        sentiment = s.name;
        return false;
      }
      return true;
    });
    return sentiment;
  };

  return (
    <div className={styles.sentimentIndicator}>
      <div className={styles.indicator}>
        <GaugeChart
          id="gauge-chart1"
          nrOfLevels={5}
          percent={props.indicatorValue.average / 100}
        />
      </div>

      <div className={styles.info}>
        <span>Today the people of delaware are feeling:</span>
        <div>
          <strong>{getSentimentName()}</strong>
        </div>
      </div>

      <div className={styles.count}>
        {`(${props.indicatorValue.count} delawarians have answered)`}
      </div>
    </div>
  );
};
