import * as React from 'react';
import { useEffect, useState } from 'react';
import PieceListPage from '../../components/pieces/PieceListPage';
import { useParams } from 'react-router';

function ViewAllPieces() {
  const { tourId } = useParams();
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    const fetchPieces = async (): Promise<any> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/pieces`);
      const json = await response.json();
      setPieces(json);
    };
    fetchPieces();
  }, [tourId]);

  return <PieceListPage pieces={pieces} />;
}

export default ViewAllPieces;
