import * as React from 'react';
import { PieceDto } from '../../../../server/src/api/dtos/piece.dto';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ViewableVideoList from './ViewableVideoList';

type PiecesSubtitleProps = {
  video: { pieces: PieceDto[] };
};

const PiecesSubtitle = ({ video }: PiecesSubtitleProps) => (
  <>
    {video.pieces && video.pieces.length > 0 && (
      <Typography variant="subtitle2" component="p">
        {'Pieces: '}
        {video.pieces &&
          video.pieces.map((piece, index) => (
            <span key={piece._id}>
              <Link to={`/tours/${piece.tour}/pieces/${piece._id}`}>
                {piece.title + (piece.code ? ` (${piece.code})` : '')}
              </Link>
              {index < video.pieces.length - 1 && ', '}
            </span>
          ))}
      </Typography>
    )}
  </>
);

type ViewableVideoListWithPiecesProps = {
  videos: { url: string; pieces: PieceDto[] }[];
};

const ViewableVideoListWithPieces = ({ videos }: ViewableVideoListWithPiecesProps) => (
  <ViewableVideoList videos={videos} subtitle={PiecesSubtitle} />
);

export default ViewableVideoListWithPieces;
