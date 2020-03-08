import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Chip, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { PieceProps } from './PieceList';
import PeopleIcon from '@material-ui/icons/People';
import ExploreIcon from '@material-ui/icons/Explore';

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
    <ListItem button component={Link} to={`/tours/${tourId}/pieces/${piece._id}`} key={piece._id}>
      <ListItemAvatar>
        <Avatar>{showChartsInfo ? rank : <MusicNoteIcon />}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={piece.title} secondary={pieceCredits} />
      <ListItemSecondaryAction>
        {showChartsInfo ? (
          showNumberOfPerformances ? (
            <Chip label={numberOfPerformances} title="Number of performances" color="default" icon={<ExploreIcon />} />
          ) : (
            <Chip label={audienceCount} title="Total audience count" color="default" icon={<PeopleIcon />} />
          )
        ) : (
          <Link to={`/pieces/${piece._id}`}>
            <Chip label={piece.code} />
          </Link>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default PieceListItem;
