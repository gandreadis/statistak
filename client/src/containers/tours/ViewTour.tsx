import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ViewableTour from '../../components/tours/ViewableTour';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '../../contexts/auth0-context';

function ViewTour() {
  let history = useHistory();
  let { tourId } = useParams();
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  const [tour, setTour] = useState<any>({});
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}`);
      const json = await response.json();
      setTour(json);
    };
    fetchData();
  }, [tourId]);

  const onEdit = async (e: React.MouseEvent): Promise<void> => {
    history.push(`/tours/${tourId}/edit`);
  };

  const onDelete = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const deleteSuccess: boolean = await deleteTour();
    setDeleteSuccess(deleteSuccess);
    setLoading(false);
    setTimeout(() => {
      history.push('/tours');
    }, 500);
  };

  const deleteTour = async () => {
    try {
      const accessToken = await getIdTokenClaims();
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}`, {
        method: 'delete',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          authorization: `Bearer ${accessToken.__raw}`,
        }),
      });
      return response.ok;
    } catch (ex) {
      return false;
    }
  };

  return (
    <ViewableTour
      onEdit={onEdit}
      onDelete={onDelete}
      deleteSuccess={deleteSuccess}
      loading={loading}
      isAuthenticated={isAuthenticated}
      tour={tour}
      exportCsvLink={`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/csv`}
    />
  );
}

export default ViewTour;
