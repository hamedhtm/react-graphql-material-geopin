import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { ME_QUERY } from '../../graphql/queries';
import { withStyles } from '@material-ui/core/styles';
import { Context } from '../../Context';
import { graphQLClient } from '../../utils/graphQLClient';
import { useHistory, Redirect } from 'react-router';
// import Typography from "@material-ui/core/Typography";

const Login = ({ classes }) => {
  const {
    logIn,
    state: { currentUser },
  } = useContext(Context);

  const history = useHistory();

  const handleSuccess = async googleUser => {
    // console.log(googleUser)
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = graphQLClient(idToken);
      const { me } = await client.request(ME_QUERY);
      logIn(me);
      history.replace('/');
    } catch (e) {
      handleFailure(e);
    }
  };
  const handleFailure = error => {
    console.log(error);
  };

  return (
    <>
      {currentUser ? (
        <Redirect to={'/'} />
      ) : (
        <div className={classes.root}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onFailure={handleFailure}
            clientId={`316459093242-3jbn49i689tutkfs7efl5ot2pdoktbjv.apps.googleusercontent.com`}
          />
        </div>
      )}
    </>
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
