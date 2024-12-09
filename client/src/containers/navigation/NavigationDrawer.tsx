import * as React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import DrawerContents from '../../components/navigation/DrawerContents';
import { useAuth0 } from '@auth0/auth0-react';

const NavigationDrawer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tourId } = useParams();
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <DrawerContents
      goToURL={url => navigate(url)}
      onLogin={() => loginWithRedirect()}
      onLogout={() => logout({ logoutParams: {returnTo: window.location.origin } })}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      currentPath={location.pathname}
      tourId={tourId}
    />
  );
};

export default NavigationDrawer;
