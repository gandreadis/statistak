import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ViewablePerformance from '../../components/performances/ViewablePerformance';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '../../contexts/auth0-context';

function ViewPerformance() {
  let history = useHistory();
  let { tourId, performanceId } = useParams();
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  const [performance, setPerformance] = useState<any>({});
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/performances/${performanceId}`,
      );
      const json = await response.json();
      setPerformance(json);
    };
    fetchData();
  }, [tourId, performanceId]);

  const onEdit = async (e: React.MouseEvent): Promise<void> => {
    history.push(`/tours/${tourId}/performances/${performanceId}/edit`);
  };

  const onDelete = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const deleteSuccess: boolean = await deletePerformance();
    setDeleteSuccess(deleteSuccess);
    setLoading(false);
    setTimeout(() => {
      history.push('/');
    }, 500);
  };

  const deletePerformance = async () => {
    try {
      const accessToken = await getIdTokenClaims();
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/performances/${performanceId}`,
        {
          method: 'delete',
          headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
            authorization: `Bearer ${accessToken.__raw}`,
          }),
        },
      );
      return response.ok;
    } catch (ex) {
      return false;
    }
  };

  return (
    <ViewablePerformance
      onEdit={onEdit}
      onDelete={onDelete}
      deleteSuccess={deleteSuccess}
      loading={loading}
      isAuthenticated={isAuthenticated}
      performance={performance}
    />
  );
}

export default ViewPerformance;
