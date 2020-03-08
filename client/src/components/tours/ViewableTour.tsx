import * as React from 'react';
import AppBarActionButton from '../navigation/AppBarActionButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Page from '../../containers/navigation/Page';
import { Button, Grid } from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/Explore';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import StarIcon from '@material-ui/icons/Star';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Link } from 'react-router-dom';

type ViewableTourProps = {
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => Promise<void>;
  deleteSuccess: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  tour: any;
  exportCsvLink: string;
};

const ViewableTour = ({
  onEdit,
  onDelete,
  deleteSuccess,
  loading,
  isAuthenticated,
  tour,
  exportCsvLink,
}: ViewableTourProps) => (
  <Page
    title={`${tour.title} (${tour.season} ${tour.year})`}
    actionButton={
      isAuthenticated ? (
        <>
          <AppBarActionButton
            onClick={onDelete}
            loading={loading}
            actionSuccess={deleteSuccess}
            icon={<DeleteIcon />}
          />
          <AppBarActionButton onClick={onEdit} loading={false} actionSuccess={false} icon={<EditIcon />} />
        </>
      ) : (
        undefined
      )
    }
  >
    <Grid container justify="center" spacing={3}>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ExploreIcon />}
          component={Link}
          to={`/tours/${tour._id}/performances`}
        >
          View performances
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          endIcon={<LibraryMusicIcon />}
          component={Link}
          to={`/tours/${tour._id}/pieces`}
        >
          View pieces
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          endIcon={<StarIcon />}
          component={Link}
          to={`/tours/${tour._id}/charts`}
        >
          View charts
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          endIcon={<EqualizerIcon />}
          component={Link}
          to={`/tours/${tour._id}/stats`}
        >
          View stats
        </Button>
      </Grid>
      {isAuthenticated && (
        <Grid item>
          <Button variant="contained" color="primary" endIcon={<GetAppIcon />} href={exportCsvLink} download>
            Export CSV
          </Button>
        </Grid>
      )}
    </Grid>
  </Page>
);

export default ViewableTour;
