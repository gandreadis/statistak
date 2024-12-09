import * as React from 'react';
import AppBarActionButton from '../navigation/AppBarActionButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Page from '../../containers/navigation/Page';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CommentIcon from '@mui/icons-material/Comment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import PeopleIcon from '@mui/icons-material/People';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import moment from 'moment';
import { PERFORMANCE_TYPES } from './common';
import InfoItem from '../../common/InfoItem';
import { Box, Typography } from '@mui/material';
import PieceList from '../pieces/PieceList';
import ViewableVideoListWithPieces from './ViewableVideoListWithPieces';

const generateSponsorText = (performance: any) => {
  let attributes = [];
  if (performance.isWithCollection) {
    attributes.push('collection afterwards');
  }
  if (performance.isWithCDSale) {
    attributes.push('CD sale');
  }
  if (performance.isWithSponsorTalk) {
    attributes.push('groupies talk');
  }

  if (attributes.length === 1) {
    return (
      <span>
        With <strong>{attributes[0]}</strong>
      </span>
    );
  } else if (attributes.length === 2) {
    return (
      <span>
        With <strong>{attributes[0]}</strong> and <strong>{attributes[1]}</strong>
      </span>
    );
  } else if (attributes.length === 3) {
    return (
      <span>
        With <strong>{attributes[0]}</strong>, <strong>{attributes[1]}</strong>, and <strong>{attributes[2]}</strong>
      </span>
    );
  } else {
    return <span>No sponsoring actions</span>;
  }
};

type ViewablePerformanceProps = {
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => Promise<void>;
  deleteSuccess: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  performance: any;
};

const ViewablePerformance = ({
  onEdit,
  onDelete,
  deleteSuccess,
  loading,
  isAuthenticated,
  performance,
}: ViewablePerformanceProps) => (
  <Page
    title={`${performance.locationName} (${performance.city})`}
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
    <InfoItem icon={<LocationOnIcon />}>{performance.locationName}</InfoItem>
    <InfoItem icon={<LocationCityIcon />}>
      {performance.city} ({performance.country})
    </InfoItem>
    <InfoItem icon={<AccessTimeIcon />}>
      {moment(`${performance.date} ${performance.time}`, 'YYYY-MM-DD HH:mm').format('LLL')}
      {' - '}
      {`${performance.duration} min.`}
    </InfoItem>
    <InfoItem icon={<HomeWorkIcon />}>{performance.isOutside ? 'Outside' : 'Inside'}</InfoItem>
    <InfoItem icon={<NaturePeopleIcon />}>{PERFORMANCE_TYPES[performance.type as string]}</InfoItem>
    <InfoItem icon={<PeopleIcon />}>{`Audience count: ${performance.audienceCount}`}</InfoItem>
    {performance.guestConductor && (
      <InfoItem icon={<EmojiPeopleIcon />}>{`Guest conductor: ${performance.guestConductor}`}</InfoItem>
    )}
    <InfoItem icon={<MonetizationOnIcon />}>{generateSponsorText(performance)}</InfoItem>
    {performance.comments && <InfoItem icon={<CommentIcon />}>{performance.comments}</InfoItem>}

    {performance.pieces && performance.pieces.length > 0 && (
      <>
        <Box mt={2} mb={2}>
          <Typography variant="h5" component="h2" align="center">
            Setlist
          </Typography>
          <Typography variant="subtitle2" component="p" align="center">
            (Not in performance order)
          </Typography>
        </Box>
        <PieceList pieces={performance.pieces} />
      </>
    )}

    {performance.videos && performance.videos.length > 0 && (
      <>
        <Box mt={4} mb={2}>
          <Typography variant="h5" component="h2" align="center">
            Videos
          </Typography>
        </Box>
        <ViewableVideoListWithPieces videos={performance.videos} />
      </>
    )}
  </Page>
);

export default ViewablePerformance;
