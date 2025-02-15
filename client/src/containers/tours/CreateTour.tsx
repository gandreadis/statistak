import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { TourDto } from '../../../../server/src/api/dtos/tour.dto';
import EditableTour from '../../components/tours/EditableTour';
import { EMPTY_TOUR_OBJECT } from './common';

function CreateTour(): React.JSX.Element {
  let navigate = useNavigate();

  const { getIdTokenClaims } = useAuth0();
  const [values, setValues] = useState<any>({ ...EMPTY_TOUR_OBJECT });
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
      navigate('/tours');
    }, 500);
  };

  const submitForm = async (formData: {}) => {
    try {
      const accessToken = await getIdTokenClaims();
      if (!accessToken) {
        throw new Error("Access token error");
      }
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/tours`, {
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
    <EditableTour
      title="Create Tour"
      onSubmit={onSubmit}
      handleInputChanges={handleInputChanges}
      submitSuccess={submitSuccess}
      loading={loading}
      tour={values}
    />
  );
}

export default CreateTour;
