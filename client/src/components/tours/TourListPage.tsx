import * as React from 'react';
import { Card, CardContent, Grid, IconButton, Typography } from '@material-ui/core';
import Page from '../../containers/navigation/Page';
import LinkWithoutUnderline from '../../common/LinkWithoutUnderline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginBottom: theme.spacing(2),
    },
  }),
);

type TourListItem = Array<{
  _id: string;
  title: string;
  year: string;
  season: string;
}>;

type TourListPageProps = {
  tours: TourListItem;
};

const TourListPage = ({ tours }: TourListPageProps) => {
  const classes = useStyles();

  const sortedTours = [...tours];
  sortedTours.sort((a, b) => {
    if (a.year < b.year) return 1;
    if (a.year > b.year) return -1;
    if (SEASONS.indexOf(a.season) < SEASONS.indexOf(b.season)) return 1;
    if (SEASONS.indexOf(a.season) > SEASONS.indexOf(b.season)) return -1;
    return 0;
  });

  return (
    <Page
      title="Tours"
      actionButton={
        <IconButton color="inherit" component={Link} to="/tours/create">
          <AddIcon />
        </IconButton>
      }
    >
      {sortedTours.map(tour => (
        <LinkWithoutUnderline to={`/tours/${tour._id}`} key={tour._id}>
          <Card className={classes.card} variant="outlined">
            <CardContent>
              <Grid justify="space-between" container>
                <Grid item xs={6}>
                  <Typography variant="h6" component="h3">
                    {tour.title}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {tour.season} {tour.year}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </LinkWithoutUnderline>
      ))}
    </Page>
  );
};

export default TourListPage;
