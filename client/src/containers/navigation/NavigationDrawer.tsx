import * as React from 'react';
import { useHistory, useParams } from 'react-router';
import DrawerContents from '../../components/navigation/DrawerContents';
import { useAuth0 } from '../../contexts/auth0-context';

const NavigationDrawer = () => {
  const history = useHistory();
  const { tourId } = useParams();
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <DrawerContents
      goToURL={url => history.push(url)}
      onLogin={loginWithRedirect}
      onLogout={() => logout({ returnTo: window.location.origin })}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      currentPath={history.location.pathname}
      tourId={tourId}
    />
  );
};

export default NavigationDrawer;
