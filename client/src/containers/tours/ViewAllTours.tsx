import * as React from 'react';
import { useEffect, useState } from 'react';
import TourListPage from '../../components/tours/TourListPage';

function ViewAllTours() {
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    const fetchTours = async (): Promise<any> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours`);
      const json = await response.json();
      setTours(json);
    };
    fetchTours();
  }, []);

  return <TourListPage tours={tours} />;
}

export default ViewAllTours;
