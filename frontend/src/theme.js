import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6095c1",
      light: "#8bb7db",
      dark: "#3e76a4",
      grey: "#f1f1f1",
    },
    secondary: {
      main: "#9863c6",
      light: "#b88dde",
      dark: "#7a41ab",
    },
    common: {
      white: "#ffffff",
    },
  },
});

export default theme;
