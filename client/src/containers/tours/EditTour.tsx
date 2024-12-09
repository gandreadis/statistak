import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { TourDto } from '../../../../server/src/api/dtos/tour.dto';
import EditableTour from '../../components/tours/EditableTour';
import { EMPTY_TOUR_OBJECT } from './common';

function EditTour(): JSX.Element {
  let navigate = useNavigate();
  let { tourId } = useParams();

  const { getIdTokenClaims } = useAuth0();
  const [values, setValues] = useState<any>({ ...EMPTY_TOUR_OBJECT });
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}`);
      const json = await response.json();
      if (json.pieces) {
        json.pieces = json.pieces.map((p: any) => p._id);
      }
      setValues({ ...EMPTY_TOUR_OBJECT, ...json });
    };
    fetchData();
  }, [tourId]);

  const onSubmit = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const formData: TourDto = {
      title: values.title,
      year: values.year,
      season: values.season,
      color: values.color,
    };

    const submitSuccess: boolean = await submitForm(formData);
    setSubmitSuccess(submitSuccess);
    setValues({ ...values, formData });
    setLoading(false);
    setTimeout(() => {
      navigate(`/tours/${tourId}`);
    }, 500);
  };

  const submitForm = async (formData: {}) => {
    try {
      const accessToken = await getIdTokenClaims();
      if (!accessToken) {
        throw new Error("Access token error");
      }
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}`, {
        method: 'put',
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
    <EditableTour
      title="Edit Tour"
      onSubmit={onSubmit}
      handleInputChanges={handleInputChanges}
      submitSuccess={submitSuccess}
      loading={loading}
      tour={values}
    />
  );
}

export default EditTour;
