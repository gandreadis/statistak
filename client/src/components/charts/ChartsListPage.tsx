import * as React from 'react';
import { useState } from 'react';
import { Box, List, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import Page from '../../containers/navigation/Page';
import { arrayPropertyComparator } from '../../common/sorting';
import { ChartsEntryDto } from '../../../../server/src/api/dtos/charts.dto';
import Alert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';
import PieceListItem from '../pieces/PieceListItem';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box py={3}>{children}</Box>}
    </Typography>
  );
}

const ChartsList = ({ chartsEntries, sortByPerformances }: any) => (
  <Paper>
    <List>
      {chartsEntries.map((piece: any, index: number) => (
        <PieceListItem
          piece={piece.piece}
          showChartsInfo={true}
          rank={index + 1}
          numberOfPerformances={piece.numberOfPerformances}
          audienceCount={piece.audienceCount}
          showNumberOfPerformances={sortByPerformances}
          key={piece.piece._id}
        />
      ))}
    </List>
  </Paper>
);

type ChartsListPageProps = {
  chartsEntries: Array<ChartsEntryDto>;
};

const ChartsListPage = ({ chartsEntries }: ChartsListPageProps) => {
  const piecesSortedByPerformances = [...chartsEntries];
  piecesSortedByPerformances.sort(arrayPropertyComparator('-numberOfPerformances'));
  const piecesSortedByAudienceCount = [...chartsEntries];
  piecesSortedByAudienceCount.sort(arrayPropertyComparator('-audienceCount'));
  const [sortByPerformances, setSortByPerformances] = useState(true);
  const tabsValue = sortByPerformances ? 0 : 1;

  return (
    <Page title="The Ricciotti Charts">
      {chartsEntries.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>No Pieces Found</AlertTitle>
          Add some to see the charts!
        </Alert>
      ) : (
        <>
          <Tabs
            value={tabsValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={(_event, newValue) => setSortByPerformances(newValue === 0)}
            centered
          >
            <Tab label="Num. Performances" />
            <Tab label="Audience Count" />
          </Tabs>
          <TabPanel value={tabsValue} index={0}>
            <ChartsList chartsEntries={piecesSortedByPerformances} sortByPerformances={sortByPerformances} />
          </TabPanel>
          <TabPanel value={tabsValue} index={1}>
            <ChartsList chartsEntries={piecesSortedByAudienceCount} sortByPerformances={sortByPerformances} />
          </TabPanel>
        </>
      )}
    </Page>
  );
};

export default ChartsListPage;
