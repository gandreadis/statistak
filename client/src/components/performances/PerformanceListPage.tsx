import * as React from 'react';
import { Box, Card, CardContent, Chip, Grid, IconButton, Typography } from '@material-ui/core';
import Page from '../../containers/navigation/Page';
import LinkWithoutUnderline from '../../common/LinkWithoutUnderline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { Link, useParams } from 'react-router-dom';
import { arrayPropertyComparator } from '../../common/sorting';
import PeopleIcon from '@material-ui/icons/People';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import NaturePeopleIcon from '@material-ui/icons/NaturePeople';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
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
                  <Grid justify="space-between" container>
                    <Grid item xs={6}>
                      <Typography variant="h6" component="h3">
                        {performance.locationName}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {performance.city} ({performance.country})
                      </Typography>
                    </Grid>
                    <Grid item container spacing={1} xs={6} justify="flex-end">
                      <Grid item container spacing={1} justify="flex-end">
                        <Grid item>
                          <Chip label={performance.type} color="default" icon={<NaturePeopleIcon />} size="small" />
                        </Grid>
                        <Grid item>
                          <Chip label={performance.time} color="secondary" icon={<AccessTimeIcon />} size="small" />
                        </Grid>
                      </Grid>
                      <Grid item container spacing={1} justify="flex-end">
                        {performance.guestConductor && (
                          <Grid item>
                            <Chip
                              label={performance.guestConductor}
                              color="primary"
                              icon={<EmojiPeopleIcon />}
                              size="small"
                            />
                          </Grid>
                        )}
                        <Grid item>
                          <Chip
                            label={(performance.pieces ? performance.pieces.length : 0) + ' pieces'}
                            color="default"
                            icon={<LibraryMusicIcon />}
                            size="small"
                          />
                        </Grid>
                        <Grid item>
                          <Chip label={performance.audienceCount} color="default" icon={<PeopleIcon />} size="small" />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
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
