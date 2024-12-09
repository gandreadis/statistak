import * as React from 'react';
import AppBarActionButton from '../navigation/AppBarActionButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Page from '../../containers/navigation/Page';
import TitleIcon from '@mui/icons-material/Title';
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import InfoItem from '../../common/InfoItem';
import ViewableVideoListWithPerformance from './ViewableVideoListWithPerformance';
import { Box, Typography } from '@mui/material';

type ViewablePieceT = {
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => Promise<void>;
  deleteSuccess: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  piece: any;
};

const ViewablePiece = ({ onEdit, onDelete, deleteSuccess, loading, isAuthenticated, piece }: ViewablePieceT) => (
  <Page
    title={piece.title + (piece.code ? ` (${piece.code})` : '')}
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
    <InfoItem icon={<TitleIcon />}>{piece.title}</InfoItem>
    <InfoItem icon={<PersonIcon />}>{`Composer: ${piece.composer}`}</InfoItem>
    {piece.arranger && <InfoItem icon={<EditIcon />}>{`Arranger: ${piece.arranger}`}</InfoItem>}
    {piece.code && <InfoItem icon={<LabelIcon />}>{`Code: ${piece.code}`}</InfoItem>}
    {piece.soloists && piece.soloists.length > 0 && (
      <InfoItem icon={<DirectionsWalkIcon />}>
        {(piece.soloists.length > 1 ? 'Soloists: ' : 'Soloist: ') + piece.soloists.join(', ')}
      </InfoItem>
    )}
    {piece.videos && piece.videos.length > 0 && (
      <>
        <Box mt={4} mb={2}>
          <Typography variant="h5" component="h2" align="center">
            Videos
          </Typography>
        </Box>
        <ViewableVideoListWithPerformance videos={piece.videos} />
      </>
    )}
  </Page>
);

export default ViewablePiece;
