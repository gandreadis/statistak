import * as React from 'react';
import { useEffect, useState } from 'react';
import PerformanceListPage from '../../components/performances/PerformanceListPage';
import { useParams } from 'react-router';

function ViewAllPerformances() {
  const { tourId } = useParams();
  const [performances, setPerformances] = useState<any[]>([]);

  useEffect(() => {
    const fetchPerformances = async (): Promise<any> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/performances`);
      const json = await response.json();
      setPerformances(json);
    };
    fetchPerformances();
  }, [tourId]);

  return <PerformanceListPage performances={performances} />;
}

export default ViewAllPerformances;
