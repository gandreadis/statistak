import * as React from 'react';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import ExploreIcon from '@material-ui/icons/Explore';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import StarIcon from '@material-ui/icons/Star';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import InfoIcon from '@material-ui/icons/Info';
import { Link } from 'react-router-dom';

type DrawerItemProps = {
  url?: string;
  onClick?: (e: React.MouseEvent) => any;
  title: string;
  icon: React.ReactElement;
  selected?: boolean;
  disabled?: boolean;
};

const DrawerItem = ({ onClick, title, icon, url, selected, disabled }: DrawerItemProps) =>
  url ? (
    <ListItem button component={Link} to={url} key={title} onClick={onClick} selected={selected} disabled={disabled}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{title}</ListItemText>
    </ListItem>
  ) : (
    <ListItem button key={title} onClick={onClick} selected={selected} disabled={disabled}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{title}</ListItemText>
    </ListItem>
  );

type DrawerContentProps = {
  goToURL: (url: string) => any;
  onLogin: (e: React.MouseEvent) => any;
  onLogout: (e: React.MouseEvent) => any;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentPath: string;
  tourId?: string;
};

const DrawerContents = ({ onLogin, onLogout, isAuthenticated, isLoading, currentPath, tourId }: DrawerContentProps) => (
  <List>
    <DrawerItem url="/tours" title="All Tours" icon={<MapIcon />} selected={currentPath === '/'} />
    <DrawerItem
      url={`/tours/${tourId}/performances`}
      title="Performances"
      icon={<ExploreIcon />}
      selected={currentPath.includes('/performances')}
      disabled={tourId === undefined}
    />
    <DrawerItem
      url={`/tours/${tourId}/pieces`}
      title="Pieces"
      icon={<LibraryMusicIcon />}
      selected={currentPath.includes('/pieces')}
      disabled={tourId === undefined}
    />
    <DrawerItem
      url={`/tours/${tourId}/charts`}
      title="Charts"
      icon={<StarIcon />}
      selected={currentPath.includes('/charts')}
      disabled={tourId === undefined}
    />
    <DrawerItem
      url={`/tours/${tourId}/stats`}
      title="Stats"
      icon={<EqualizerIcon />}
      selected={currentPath.includes('/stats')}
      disabled={tourId === undefined}
    />
    <Divider />
    <DrawerItem url={`/about`} title="About" icon={<InfoIcon />} selected={currentPath.includes('/about')} />
    {!isLoading &&
      (isAuthenticated ? (
        <DrawerItem onClick={onLogout} title="Logout" icon={<LockOpenIcon />} />
      ) : (
        <DrawerItem onClick={onLogin} title="Admin Login" icon={<LockIcon />} />
      ))}
  </List>
);

export default DrawerContents;
