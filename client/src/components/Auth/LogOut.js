import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { GoogleLogout } from 'react-google-login';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';
import { Context } from '../../Context';

const LogOut = ({ classes }) => {
  const { logOut } = useContext(Context);

  return (
    <GoogleLogout
      onLogoutSuccess={() => logOut()}
      render={({ onClick }) => (
        <span className={classes.root} onClick={onClick}>
          <Typography variant={'body1'} className={classes.buttonText}>
            LogOut
          </Typography>
          <ExitToApp className={classes.buttonIcon} />
        </span>
      )}
    />
  );
};

const styles = {
  root: {
    cursor: 'pointer',
    display: 'flex',
  },
  buttonText: {
    color: 'orange',
  },
  buttonIcon: {
    marginLeft: '5px',
    color: 'orange',
  },
};

export default withStyles(styles)(LogOut);
