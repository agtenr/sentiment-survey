import { IDialogStyleProps, IDialogStyles } from "office-ui-fabric-react/lib/Dialog";

export const getDialogStyles = (props: IDialogStyleProps): IDialogStyles => {
  return {
    main: {
      selectors: {
        "@media (min-width: 500px)": {
          maxWidth: "600px",
          minWidth: "500px"
        },
        "@media (min-width: 480px)": {
          width: "90%",
          maxWidth: "90%"
        }
      },
      width: "90%",
      maxWidth: "90%"
    },
    root: {}
  };
};
