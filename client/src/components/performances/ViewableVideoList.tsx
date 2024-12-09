import * as React from 'react';
import YouTube from 'react-youtube';
import queryString from 'query-string';
import { Box, Paper } from '@mui/material';

type ViewableVideoListProps = {
  videos: { url: string }[];
  subtitle: React.JSXElementConstructor<any>;
};

const ViewableVideoList = ({ videos, subtitle }: ViewableVideoListProps) => (
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

          {React.createElement(subtitle, { video })}
        </Box>
      </Paper>
    ))}
  </>
);

export default ViewableVideoList;
