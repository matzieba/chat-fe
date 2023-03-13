import React from 'react';
import { useParams } from 'react-router';

import { EditCompany as EditCompanyView } from '@modules/Companies/views';


export const EditCompany: React.FC = () => {

  const { companyId = '' } = useParams();

  return (
    <EditCompanyView companyId={parseInt(companyId, 10)} />
  );
};
