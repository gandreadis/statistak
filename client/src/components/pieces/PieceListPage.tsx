import * as React from 'react';
import { IconButton } from '@mui/material';
import Page from '../../containers/navigation/Page';
import AddIcon from '@mui/icons-material/Add';
import { Link, useParams } from 'react-router-dom';
import { arrayPropertyComparator } from '../../common/sorting';
import PieceList, { PieceProps } from './PieceList';

type PieceListPageProps = {
  pieces: Array<PieceProps>;
};

const PieceListPage = ({ pieces }: PieceListPageProps) => {
  const { tourId } = useParams();
  const sortedPieces = [...pieces];
  sortedPieces.sort(arrayPropertyComparator('code'));

  return (
    <Page
      title="Pieces"
      actionButton={
        <IconButton color="inherit" component={Link} to={`/tours/${tourId}/pieces/create`}>
          <AddIcon />
        </IconButton>
      }
    >
      {sortedPieces.length > 0 && <PieceList pieces={sortedPieces} />}
    </Page>
  );
};

export default PieceListPage;
