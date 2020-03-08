import React, { useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { ME_QUERY } from '../../graphql/queries';
import { withStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../AuthContext';
// import Typography from "@material-ui/core/Typography";

const Login = ({ classes }) => {
  const { logIn } = useContext(AuthContext);

  const handleSuccess = async googleUser => {
    // console.log(googleUser)
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient('http://localhost:4000/graphql', {
        headers: {
          authorization: idToken,
        },
      });
      const { user } = await client.request(ME_QUERY);
      logIn(user);
    } catch (e) {
      handleFailure(e);
    }
  };
  const handleFailure = error => {
    console.log(error);
  };

  return (
    <div className={classes.root}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        clientId={`316459093242-3jbn49i689tutkfs7efl5ot2pdoktbjv.apps.googleusercontent.com`}
      />
    </div>
  );
};

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default withStyles(styles)(Login);
