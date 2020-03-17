import * as React from 'react';
import Page from '../../containers/navigation/Page';
import { StatsDto } from '../../../../server/src/api/dtos/stats.dto';
import Alert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Box, Typography } from '@material-ui/core';

const MAX_BAR_SIZE = 60;
const MAX_Y_LABELS_WIDTH = 30;

const NoInfoAlert = () => (
  <Alert severity="info">
    <AlertTitle>No Meaningful Info to Show</AlertTitle>
    Add some performances and pieces!
  </Alert>
);

const StatsSectionHeader = ({ text }: any) => (
  <Box mt={3} mb={2}>
    <Typography variant="h5" align="center">
      {text}
    </Typography>
  </Box>
);

type StatsChartProps = {
  data: any[];
  xKey: string;
  yKey: string;
  children?: React.ReactNode;
};

const ResponsiveChartContainer = ({ children }: any) => (
  <ResponsiveContainer width="100%" height={300}>
    {children}
  </ResponsiveContainer>
);

const StatsBarChart = ({ data, xKey, yKey, children }: StatsChartProps) => (
  <ResponsiveChartContainer>
    <BarChart data={data}>
      <XAxis dataKey={xKey} />
      <YAxis allowDecimals={false} width={MAX_Y_LABELS_WIDTH} />
      <Tooltip />
      <CartesianGrid strokeDasharray="3 3" />
      {children ? children : <Bar dataKey={yKey} fill="#8884d8" maxBarSize={MAX_BAR_SIZE} />}
    </BarChart>
  </ResponsiveChartContainer>
);

const StatsLineChart = ({ data, xKey, yKey }: StatsChartProps) => (
  <ResponsiveChartContainer>
    <LineChart data={data}>
      <XAxis dataKey={xKey} />
      <YAxis allowDecimals={false} width={MAX_Y_LABELS_WIDTH} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
    </LineChart>
  </ResponsiveChartContainer>
);

type StatsPageProps = {
  stats: StatsDto;
};

const StatsPage = ({ stats }: StatsPageProps) => {
  return (
    <Page title="Stats">
      {Object.keys(stats.numPerformances).length === 0 ? (
        <NoInfoAlert />
      ) : (
        <>
          <StatsSectionHeader text="Total Number of Performances" />
          <StatsBarChart data={stats.numPerformances} xKey="_id" yKey="numPerformances" />

          <StatsSectionHeader text="Number of Performances per Day" />
          <StatsLineChart data={stats.numPerformancesPerDay} xKey="_id" yKey="numPerformances" />

          <StatsSectionHeader text="Average Number of Performances per Day" />
          <StatsBarChart data={stats.meanNumPerformancesPerDay} xKey="_id" yKey="meanNumPerformances" />

          <StatsSectionHeader text="Number of Performances Outside" />
          {stats.numPerformancesOutside.length === 0 ? (
            <Alert severity="info">
              <AlertTitle>No Performances Outside</AlertTitle>
              None of the performances seem to have been outside. (Note that this count does not include potential
              walking-piece excursions before the performance.)
            </Alert>
          ) : (
            <StatsBarChart data={stats.numPerformancesOutside} xKey="_id" yKey="numPerformances" />
          )}

          <StatsSectionHeader text="Number of Performances per Type" />
          <StatsBarChart data={stats.numPerformancesByType} xKey="_id" yKey="not-needed">
            <Bar dataKey="SO" fill="#8884d8" maxBarSize={MAX_BAR_SIZE} />
            <Bar dataKey="SB" fill="#82ca9d" maxBarSize={MAX_BAR_SIZE} />
            <Bar dataKey="O" fill="#ffc658" maxBarSize={MAX_BAR_SIZE} />
            <Bar dataKey="WO" fill="#FF8042" maxBarSize={MAX_BAR_SIZE} />
            <Legend />
          </StatsBarChart>

          <StatsSectionHeader text="Average Guest Conductor Name" />
          <Typography variant="subtitle1" component="p">
            During this tour, we had lots of guest conductors lead our orchestra. If we put all of their names together,
            this is their collective name: <strong>{stats.averageGuestConductorName}</strong>
          </Typography>
        </>
      )}
    </Page>
  );
};

export default StatsPage;
