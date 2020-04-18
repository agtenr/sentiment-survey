import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp/presets/all";
import SentimentSurvey from "./components/SentimentSurvey";
import { ISentimentSurveyProps } from "./components/ISentimentSurveyProps";

export interface ISentimentSurveyWebPartProps {
  title: string;
  listId: string;

}

export default class SentimentSurveyWebPart extends BaseClientSideWebPart <ISentimentSurveyWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISentimentSurveyProps> = React.createElement(
      SentimentSurvey,
      {
        displayMode: this.displayMode,
        title: this.properties.title,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
        listId: this.properties.listId,
        userLogin: this.context.pageContext.user.loginName,
        onConfigure: this._onConfigure
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    sp.setup(this.context);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Select a list for the Sentiment Survey answers"
          },
          groups: [
            {
              groupName: "",
              groupFields: [
                PropertyFieldListPicker("listId", {
                  label: "Select a list",
                  selectedList: this.properties.listId,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: "listPickerFieldId"
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private _onConfigure = () => {
    this.context.propertyPane.open();
  }
}
