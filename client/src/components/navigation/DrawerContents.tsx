import * as React from 'react';
import { Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ExploreIcon from '@mui/icons-material/Explore';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import StarIcon from '@mui/icons-material/Star';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InfoIcon from '@mui/icons-material/Info';
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
    <ListItemButton component={Link} to={url} key={title} onClick={onClick} selected={selected} disabled={disabled}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{title}</ListItemText>
    </ListItemButton>
  ) : (
    <ListItemButton key={title} onClick={onClick} selected={selected} disabled={disabled}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{title}</ListItemText>
    </ListItemButton>
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
