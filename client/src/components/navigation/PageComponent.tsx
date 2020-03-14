import * as React from 'react';
import {AppBar, Container, Drawer, Hidden, IconButton, SwipeableDrawer, Toolbar, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import NavigationDrawer from '../../containers/navigation/NavigationDrawer';
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles';
import { Helmet } from 'react-helmet';

const DRAWER_WIDTH = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: DRAWER_WIDTH,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    toolbar: theme.mixins.toolbar as CreateCSSProperties,
    drawerPaper: {
      width: DRAWER_WIDTH,
    },
    content: {
      flexGrow: 1,
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  }),
);

type PageComponentProps = {
  title: string;
  actionButton?: JSX.Element;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  children: React.ReactNode;
};

const PageComponent = ({ title, actionButton, mobileOpen, handleDrawerToggle, children }: PageComponentProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{title} - Statistak</title>
      </Helmet>

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.menuButton}
            onClick={() => handleDrawerToggle()}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap={true}>
            {title}
          </Typography>
          <div style={{ flexGrow: 1 }} />
          {actionButton}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="menu">
        <Hidden smUp implementation="css">
          <SwipeableDrawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            onOpen={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{ keepMounted: true }}
          >
            <NavigationDrawer />
          </SwipeableDrawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            open
          >
            <NavigationDrawer />
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Container maxWidth="sm">{children}</Container>
      </main>
    </div>
  );
};

export default PageComponent;
