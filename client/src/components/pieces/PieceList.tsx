import * as React from 'react';
import { List, Paper } from '@mui/material';
import { arrayPropertyComparator } from '../../common/sorting';
import PieceListItem from './PieceListItem';

export type PieceProps = {
  _id: string;
  title: string;
  composer: string;
  arranger: string;
  code: string;
};

type PieceListProps = {
  pieces: Array<PieceProps>;
};

const PieceList = ({ pieces }: PieceListProps) => {
  const sortedPieces = [...pieces];
  sortedPieces.sort(arrayPropertyComparator('code'));

  return (
    <Paper>
      <List>
        {sortedPieces.map(piece => (
          <PieceListItem piece={piece} key={piece._id} />
        ))}
      </List>
    </Paper>
  );
};

export default PieceList;
