import * as React from 'react';
import { useEffect, useState } from 'react';
import StatsPage from '../../components/stats/StatsPage';
import { useParams } from 'react-router';
import { EMPTY_STATS_OBJECT } from './common';

function ViewStats() {
  const { tourId } = useParams();
  const [stats, setStats] = useState<any>({ ...EMPTY_STATS_OBJECT });

  useEffect(() => {
    const fetchStats = async (): Promise<any> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/stats`);
      const json = await response.json();
      setStats(json);
    };
    fetchStats();
  }, [tourId]);

  return <StatsPage stats={stats} />;
}

export default ViewStats;
