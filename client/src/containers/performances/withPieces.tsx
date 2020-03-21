import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { arrayPropertyComparator } from '../../common/sorting';

function withPieces(WrappedComponent: React.JSXElementConstructor<any>) {
  return (props: any) => {
    let { tourId } = useParams();
    const [allPieces, setAllPieces] = useState<any[]>([]);

    useEffect(() => {
      const fetchPieces = async (): Promise<any> => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/pieces`);
        const json = await response.json();
        const sortedPieces = [...json];
        sortedPieces.sort(arrayPropertyComparator('code'));
        setAllPieces(sortedPieces);
      };
      fetchPieces();
    }, [tourId]);

    return <WrappedComponent allPieces={allPieces} {...props} />;
  };
}

export default withPieces;
