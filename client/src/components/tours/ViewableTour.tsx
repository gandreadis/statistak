import * as React from 'react';
import AppBarActionButton from '../navigation/AppBarActionButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Page from '../../containers/navigation/Page';
import { Button, Grid2 } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import StarIcon from '@mui/icons-material/Star';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Link } from 'react-router-dom';

type ViewableTourProps = {
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => Promise<void>;
  deleteSuccess: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  tour: any;
  exportXlsxLink: string;
};

const ViewableTour = ({
  onEdit,
  onDelete,
  deleteSuccess,
  loading,
  isAuthenticated,
  tour,
  exportXlsxLink,
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
    <Grid2 container justifyContent="center" spacing={3}>
      <Grid2>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ExploreIcon />}
          component={Link}
          to={`/tours/${tour._id}/performances`}
        >
          View performances
        </Button>
      </Grid2>
      <Grid2>
        <Button
          variant="contained"
          color="primary"
          endIcon={<LibraryMusicIcon />}
          component={Link}
          to={`/tours/${tour._id}/pieces`}
        >
          View pieces
        </Button>
      </Grid2>
      <Grid2>
        <Button
          variant="contained"
          color="primary"
          endIcon={<StarIcon />}
          component={Link}
          to={`/tours/${tour._id}/charts`}
        >
          View charts
        </Button>
      </Grid2>
      <Grid2>
        <Button
          variant="contained"
          color="primary"
          endIcon={<EqualizerIcon />}
          component={Link}
          to={`/tours/${tour._id}/stats`}
        >
          View stats
        </Button>
      </Grid2>
      {/* {isAuthenticated && ( */}
        <Grid2>
          <Button variant="contained" color="primary" endIcon={<GetAppIcon />} href={exportXlsxLink} download>
            Export Excel (.xlsx)
          </Button>
        </Grid2>
      {/* )} */}
    </Grid2>
  </Page>
);

export default ViewableTour;
