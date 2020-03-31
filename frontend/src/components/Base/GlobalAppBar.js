import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, withStyles } from "material-ui";

const styles = {
  flex: {
    flex: 1,
  },
  icon: {
    marginLeft: "10px",
    marginRight: "10px",
  },
};

class GlobalAppBar extends PureComponent {
  static propTypes = {
    hospitalName: PropTypes.string,
    classes: PropTypes.object.isRequired,
    isConnected: PropTypes.bool,
    userName: PropTypes.string,
  };

  static defaultProps = {
    isConnected: false,
  };

  state = {};

  button = null;

  handleParamClick = () => {
    return;
  };

  handleDisconnectClick = () => {
    return;
  };

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            {this.props.hospitalName}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(GlobalAppBar);
