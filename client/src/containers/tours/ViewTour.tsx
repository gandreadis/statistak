import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ViewableTour from '../../components/tours/ViewableTour';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function ViewTour() {
  let navigate = useNavigate();
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
    navigate(`/tours/${tourId}/edit`);
  };

  const onDelete = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const deleteSuccess: boolean = await deleteTour();
    setDeleteSuccess(deleteSuccess);
    setLoading(false);
    setTimeout(() => {
      navigate('/tours');
    }, 500);
  };

  const deleteTour = async () => {
    try {
      const accessToken = await getIdTokenClaims();
      if (!accessToken) {
        throw new Error("Access token error");
      }
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
      exportFundingXlsxLink={`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/fundingXlsx`}
      exportBumaXlsxLink={`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/bumaXlsx`}
    />
  );
}

export default ViewTour;
