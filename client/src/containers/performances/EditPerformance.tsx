import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { PerformanceDto } from '../../../../server/src/api/dtos/performance.dto';
import EditablePerformance from '../../components/performances/EditablePerformance';
import { EMPTY_PERFORMANCE_OBJECT } from './common';

function EditPerformance(): React.JSX.Element {
  let navigate = useNavigate();
  let { tourId, performanceId } = useParams();

  const { getIdTokenClaims } = useAuth0();
  const [values, setValues] = useState<any>({ ...EMPTY_PERFORMANCE_OBJECT });
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/performances/${performanceId}`,
      );
      const json = await response.json();
      if (json.pieces) {
        json.pieces = json.pieces.map((p: any) => p._id);
      }
      setValues({ ...EMPTY_PERFORMANCE_OBJECT, ...json });
    };
    fetchData();
  }, [tourId, performanceId]);

  const onSubmit = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const formData: PerformanceDto = {
      locationName: values.locationName,
      city: values.city,
      country: values.country,
      date: values.date,
      time: values.time,
      duration: values.duration,
      isOutside: values.isOutside,
      type: values.type,
      audienceCount: values.audienceCount,
      guestConductor: values.guestConductor,
      isWithCollection: values.isWithCollection,
      isWithCDSale: values.isWithCDSale,
      isWithSponsorTalk: values.isWithSponsorTalk,
      comments: values.comments,
      videos: values.videos,
      pieces: values.pieces,
    };

    const submitSuccess: boolean = await submitForm(formData);
    setSubmitSuccess(submitSuccess);
    setValues({ ...values, formData });
    setLoading(false);
    setTimeout(() => {
      navigate(`/tours/${tourId}/performances/${performanceId}`);
    }, 500);
  };

  const submitForm = async (formData: {}) => {
    try {
      const accessToken = await getIdTokenClaims();
      if (!accessToken) {
        throw new Error("Access token error");
      }
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/tours/${tourId}/performances/${performanceId}`,
        {
          method: 'put',
          headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
            authorization: `Bearer ${accessToken.__raw}`,
          }),
          body: JSON.stringify(formData),
        },
      );
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
    <EditablePerformance
      title="Edit Performance"
      onSubmit={onSubmit}
      handleInputChanges={handleInputChanges}
      submitSuccess={submitSuccess}
      loading={loading}
      performance={values}
    />
  );
}

export default EditPerformance;
