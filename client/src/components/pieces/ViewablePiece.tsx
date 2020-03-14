import * as React from 'react';
import AppBarActionButton from '../navigation/AppBarActionButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Page from '../../containers/navigation/Page';
import TitleIcon from '@material-ui/icons/Title';
import PersonIcon from '@material-ui/icons/Person';
import LabelIcon from '@material-ui/icons/Label';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import InfoItem from '../../common/InfoItem';

type ViewablePiece = {
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => Promise<void>;
  deleteSuccess: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  piece: any;
};

const ViewablePiece = ({ onEdit, onDelete, deleteSuccess, loading, isAuthenticated, piece }: ViewablePiece) => (
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
  </Page>
);

export default ViewablePiece;
