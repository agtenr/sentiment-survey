import * as React from "react";
import styles from "./SentimentScopeSelector.module.scss";
import { ISentimentScopeSelectorProps } from "./ISentimentScopeSelectorProps";
import { IIndicatorScope } from "../../../../models/IIndicatorScope";

export const SentimentScopeSelector: React.SFC<ISentimentScopeSelectorProps> = (props: ISentimentScopeSelectorProps) => {
  return (
    <div className={styles.sentimentSelector}>
      {props.scopes.map((scope: IIndicatorScope, index: number) => {
        const isSelected: boolean = scope.key === props.selectedScope.key;
        return (
          <span
            className={isSelected ? styles.selected : ""}
            key={index}
            onClick={() => props.onScopeChange(scope)}
          >
            {scope.name}
          </span>
        );
      })}
    </div>
  );
};
