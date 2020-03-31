import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, withStyles } from "material-ui";
import TextField from "material-ui/TextField";

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  whiteText: {
    color: "white",
    "&::before": {
      backgroundColor: "rgba(255, 255, 255, 0.42) !important",
    },
    "&::after": {
      backgroundColor: "white",
    },
  },
  centerFrame: {
    backgroundColor: theme.palette.primary.main,
    margin: "auto",
    maxWidth: "400px",
    padding: "13px",
  },
  btnLine: {
    margin: "15px",
  },
});

class Login extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
  };

  state = {
    username: "",
    password: "",
  };

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  authenticate = async () => {
    //  const res = await reqCreateSession(this.state.sessionName);
    return;
  };

  getNewPassword = async () => {
    // const res = await reqGetSession(this.state.sessionHash);
    return;
  };

  render() {
    const { className, classes } = this.props;
    return (
      <div>
        <div className={className}>
          <div className={classes.centerFrame}>
            <p className={classes.whiteText}>Merci de vous identifier</p>
            <TextField
              label="Identifiant APH (4 à 7 chiffres)"
              id="username"
              defaultValue=""
              onChange={this.handleChange}
              labelClassName={classes.whiteText}
              helperTextClassName={classes.whiteText}
              InputProps={{ className: classes.whiteText }}
              className={classes.textField}
              helperText="Identifiant APH (4 à 7 chiffres)"
            />

            <TextField
              label="Mot de passe"
              id="password"
              defaultValue=""
              type="password"
              onChange={this.handleChange}
              labelClassName={classes.whiteText}
              helperTextClassName={classes.whiteText}
              InputProps={{ className: classes.whiteText }}
              className={classes.textField}
            />

            <div className={classes.btnLine}>
              <Button
                variant="flat"
                color="secondary"
                onClick={this.authenticate}
              >
                Connexion
              </Button>
              <Button
                variant="flat"
                color="secondary"
                onClick={this.getNewPassword}
              >
                Mot de passe oublié
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
