import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { PieceDto } from '../../../../server/src/api/dtos/piece.dto';
import EditablePiece from '../../components/pieces/EditablePiece';
import { EMPTY_PIECE_OBJECT } from './common';

function CreatePiece(): JSX.Element {
  let navigate = useNavigate();
  let { tourId } = useParams();

  const { getIdTokenClaims } = useAuth0();
  const [values, setValues] = useState<any>({ ...EMPTY_PIECE_OBJECT });
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const formData: PieceDto = {
      title: values.title,
      composer: values.composer,
      arranger: values.arranger,
      code: values.code,
      tour: tourId,
    };

    const submitSuccess: boolean = await submitForm(formData);
    setSubmitSuccess(submitSuccess);
    setValues({ ...values, formData });
    setLoading(false);
    setTimeout(() => {
      navigate(`/tours/${tourId}/pieces`);
    }, 500);
  };

  const submitForm = async (formData: {}) => {
    try {
      const accessToken = await getIdTokenClaims();
      if (!accessToken) {
        throw new Error("Access token error");
      }
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/pieces`, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          authorization: `Bearer ${accessToken.__raw}`,
        }),
        body: JSON.stringify(formData),
      });
      return response.ok;
    } catch (ex) {
      return false;
    }
  };

  const setFormValues = (formValues: any) => {
    setValues({ ...values, ...formValues });
  };

  const handleInputChanges = (name: string, value: string) => {
    setFormValues({ [name]: value });
  };

  return (
    <EditablePiece
      title="Create Piece"
      onSubmit={onSubmit}
      handleInputChanges={handleInputChanges}
      submitSuccess={submitSuccess}
      loading={loading}
      piece={values}
    />
  );
}

export default CreatePiece;
