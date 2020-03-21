import * as React from 'react';
import { PerformanceDto } from '../../../../server/src/api/dtos/performance.dto';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ViewableVideoList from '../performances/ViewableVideoList';

type PerformanceSubtitleProps = {
  video: { performance: PerformanceDto };
};

const PerformanceSubtitle = ({ video }: PerformanceSubtitleProps) => (
  <>
    {video.performance && (
      <Typography variant="subtitle2" component="p">
        {'Performance: '}
        <Link to={`/tours/${video.performance.tour}/performances/${video.performance._id}`}>
          {`${video.performance.locationName} (${video.performance.date})`}
        </Link>
      </Typography>
    )}
  </>
);

type ViewableVideoListWithPerformanceProps = {
  videos: { url: string; performances: PerformanceDto[] }[];
};

const ViewableVideoListWithPerformance = ({ videos }: ViewableVideoListWithPerformanceProps) => (
  <ViewableVideoList videos={videos} subtitle={PerformanceSubtitle} />
);

export default ViewableVideoListWithPerformance;
