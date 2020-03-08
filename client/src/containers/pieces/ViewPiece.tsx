import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ViewablePiece from '../../components/pieces/ViewablePiece';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '../../contexts/auth0-context';

function ViewPiece() {
  let history = useHistory();
  let { tourId, pieceId } = useParams();
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  const [piece, setPiece] = useState<any>({});
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/pieces/${pieceId}`);
      const json = await response.json();
      setPiece(json);
    };
    fetchData();
  }, [tourId, pieceId]);

  const onEdit = async (e: React.MouseEvent): Promise<void> => {
    history.push(`/tours/${tourId}/pieces/${pieceId}/edit`);
  };

  const onDelete = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const deleteSuccess: boolean = await deletePiece();
    setDeleteSuccess(deleteSuccess);
    setLoading(false);
    setTimeout(() => {
      history.push(`/tours/${tourId}/pieces`);
    }, 500);
  };

  const deletePiece = async () => {
    try {
      const accessToken = await getIdTokenClaims();
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/pieces/${pieceId}`, {
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
    <ViewablePiece
      onEdit={onEdit}
      onDelete={onDelete}
      deleteSuccess={deleteSuccess}
      loading={loading}
      isAuthenticated={isAuthenticated}
      piece={piece}
    />
  );
}

export default ViewPiece;
