import * as React from 'react';
import { useEffect, useState } from 'react';
import ChartsListPage from '../../components/charts/ChartsListPage';
import { useParams } from 'react-router';

function ViewCharts() {
  const { tourId } = useParams();
  const [charts, setCharts] = useState<any[]>([]);

  useEffect(() => {
    const fetchCharts = async (): Promise<any> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/charts`);
      const json = await response.json();
      setCharts(json);
    };
    fetchCharts();
  }, [tourId]);

  return <ChartsListPage chartsEntries={charts} />;
}

export default ViewCharts;
