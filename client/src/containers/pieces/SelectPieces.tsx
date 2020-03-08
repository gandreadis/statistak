import * as React from 'react';
import { useEffect, useState } from 'react';
import SelectablePieceList from '../../components/pieces/SelectablePieceList';
import { useParams } from 'react-router-dom';

type SelectPiecesProps = {
  selectedPieceIds: string[];
  setSelectedPieceIds: (newSelectedPieceIds: string[]) => void;
};

function SelectPieces({ selectedPieceIds, setSelectedPieceIds }: SelectPiecesProps) {
  let { tourId } = useParams();
  const [allPieces, setAllPieces] = useState<any[]>([]);

  useEffect(() => {
    const fetchPieces = async (): Promise<any> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/pieces`);
      const json = await response.json();
      setAllPieces(json);
    };
    fetchPieces();
  }, [tourId]);

  return (
    <SelectablePieceList
      allPieces={allPieces}
      selectedPieceIds={selectedPieceIds}
      setSelectedPieceIds={setSelectedPieceIds}
    />
  );
}

export default SelectPieces;
