import * as React from 'react';
import { Box, Card, CardContent, Chip, Grid2, IconButton, Typography } from '@mui/material';
import Page from '../../containers/navigation/Page';
import LinkWithoutUnderline from '../../common/LinkWithoutUnderline';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { Link, useParams } from 'react-router-dom';
import { arrayPropertyComparator } from '../../common/sorting';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginBottom: theme.spacing(2),
    },
  }),
);

type PerformanceListItem = Array<{
  _id: string;
  locationName: string;
  city: string;
  country: string;
  date: string;
  time: string;
  type: string;
  audienceCount: number;
  guestConductor: string;
  pieces: any[];
  videos: any[];
}>;

type PerformanceListPageProps = {
  performances: PerformanceListItem;
};

const PerformanceListPage = ({ performances }: PerformanceListPageProps) => {
  const classes = useStyles();
  const { tourId } = useParams();

  const dateToPerformances: { [key: string]: PerformanceListItem } = {};
  const performancesPerDay = [];

  performances.forEach(performance => {
    if (dateToPerformances.hasOwnProperty(performance.date)) {
      dateToPerformances[performance.date].push(performance);
    } else {
      dateToPerformances[performance.date] = [performance];
    }
  });

  for (const date in dateToPerformances) {
    if (dateToPerformances.hasOwnProperty(date)) {
      dateToPerformances[date].sort(arrayPropertyComparator('-time'));
      performancesPerDay.push({
        date,
        performances: dateToPerformances[date],
      });
    }
  }

  performancesPerDay.sort(arrayPropertyComparator('-date'));

  return (
    <Page
      title="Performances"
      actionButton={
        <IconButton color="inherit" component={Link} to={`/tours/${tourId}/performances/create`}>
          <AddIcon />
        </IconButton>
      }
    >
      {performancesPerDay.map(day => (
        <Box mb={4} key={day.date}>
          <Box mb={2}>
            <Typography variant="h5" component="h2" align="center">
              {moment(`${day.date}`, 'YYYY-MM-DD').format('LL')}
            </Typography>
          </Box>
          {day.performances.map(performance => (
            <LinkWithoutUnderline to={`/tours/${tourId}/performances/${performance._id}`} key={performance._id}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Grid2 justifyContent="space-between" container>
                    <Grid2 size={{xs: 6}}>
                      <Typography variant="h6" component="h3">
                        {performance.locationName}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {performance.city} ({performance.country})
                      </Typography>
                    </Grid2>
                    <Grid2 container spacing={1} size={{xs: 6}} justifyContent="flex-end">
                      <Grid2 container spacing={1} justifyContent="flex-end">
                        <Grid2>
                          <Chip label={performance.audienceCount} color="default" icon={<PeopleIcon />} size="small" />
                        </Grid2>
                        <Grid2>
                          <Chip label={performance.time} color="secondary" icon={<AccessTimeIcon />} size="small" />
                        </Grid2>
                      </Grid2>
                      <Grid2 container spacing={1} justifyContent="flex-end">
                        {performance.guestConductor && (
                          <Grid2>
                            <Chip
                              label={performance.guestConductor}
                              color="primary"
                              icon={<EmojiPeopleIcon />}
                              size="small"
                            />
                          </Grid2>
                        )}
                        {performance.videos && performance.videos.length > 0 && (
                          <Grid2>
                            <Chip
                              label={performance.videos.length}
                              color="secondary"
                              icon={<YouTubeIcon />}
                              size="small"
                            />
                          </Grid2>
                        )}
                        <Grid2>
                          <Chip
                            label={(performance.pieces ? performance.pieces.length : 0) + ' pieces'}
                            color="default"
                            icon={<LibraryMusicIcon />}
                            size="small"
                          />
                        </Grid2>
                      </Grid2>
                    </Grid2>
                  </Grid2>
                </CardContent>
              </Card>
            </LinkWithoutUnderline>
          ))}
        </Box>
      ))}
    </Page>
  );
};

export default PerformanceListPage;
