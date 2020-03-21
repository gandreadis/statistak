import * as React from 'react';
import { PieceDto } from '../../../../server/src/api/dtos/piece.dto';
import YouTube from 'react-youtube';
import queryString from 'query-string';
import { Box, Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

type ViewableVideoListProps = {
  videos: { url: string; pieces: PieceDto[] }[];
};

const ViewableVideoList = ({ videos }: ViewableVideoListProps) => (
  <>
    {videos.map((video, index) => (
      <Paper key={index}>
        <Box p={2} mb={2}>
          <YouTube
            videoId={queryString.parseUrl(video.url).query.v as string}
            opts={{
              width: '100%',
              height: '320px',
            }}
          />

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
        </Box>
      </Paper>
    ))}
  </>
);

export default ViewableVideoList;
