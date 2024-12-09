import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Chip, ListItemButton, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { PieceProps } from './PieceList';

type PieceListItemProps = {
  piece: PieceProps;
  showChartsInfo?: boolean;
  rank?: number;
  numberOfPerformances?: number;
  audienceCount?: number;
  showNumberOfPerformances?: boolean;
};

const PieceListItem = ({
  piece,
  showChartsInfo,
  rank,
  numberOfPerformances,
  audienceCount,
  showNumberOfPerformances,
}: PieceListItemProps) => {
  const { tourId } = useParams();
  const pieceCredits = piece.composer
    ? piece.composer + (piece.arranger ? ` (arr. ${piece.arranger})` : '')
    : 'No composer';

  return (
    <ListItemButton component={Link} to={`/tours/${tourId}/pieces/${piece._id}`} key={piece._id}>
      <ListItemAvatar>
        <Avatar>{showChartsInfo ? rank : <MusicNoteIcon />}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={piece.title} secondary={pieceCredits} />
      <ListItemSecondaryAction>
        {showChartsInfo ? (
          showNumberOfPerformances ? (
            <Chip label={numberOfPerformances} title="Number of performances" color="secondary" />
          ) : (
            <Chip label={audienceCount} title="Total audience count" color="secondary" />
          )
        ) : (
          <Chip label={piece.code} />
        )}
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

export default PieceListItem;
