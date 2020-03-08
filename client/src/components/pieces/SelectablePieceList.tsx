import * as React from 'react';
import {
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from '@material-ui/core';
import { arrayPropertyComparator } from '../../common/sorting';
import { PieceProps } from './PieceList';

type SelectablePieceListProps = {
  allPieces: Array<PieceProps>;
  selectedPieceIds: Array<string>;
  setSelectedPieceIds: (newPieceIds: Array<string>) => void;
};

const SelectablePieceList = ({ allPieces, selectedPieceIds, setSelectedPieceIds }: SelectablePieceListProps) => {
  const sortedPieces = [...allPieces];
  sortedPieces.sort(arrayPropertyComparator('code'));

  const handleToggle = (pieceId: string) => () => {
    const currentIndex = selectedPieceIds.indexOf(pieceId);
    const newPieceIds = [...selectedPieceIds];

    if (currentIndex === -1) {
      newPieceIds.push(pieceId);
    } else {
      newPieceIds.splice(currentIndex, 1);
    }

    setSelectedPieceIds(newPieceIds);
  };

  return (
    <Paper>
      <List>
        {sortedPieces.map(piece => (
          <ListItem key={piece._id} dense button onClick={handleToggle(piece._id)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={selectedPieceIds.indexOf(piece._id) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': `piece-label-${piece._id}` }}
              />
            </ListItemIcon>
            <ListItemText
              id={`piece-label-${piece._id}`}
              primary={piece.title}
              secondary={piece.composer + (piece.arranger ? ` (arr. ${piece.arranger})` : '')}
            />
            <ListItemSecondaryAction>
              <Chip label={piece.code} />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SelectablePieceList;
