import React from 'react';
import { useNavigate } from 'react-router';
import { Grid, Box, Paper, Typography, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';

import { DialogContext, LocalizationContext } from '@cvt/contexts';
import { BodyLoading } from '@cvt/components/layout/BodyLoading';
import { MessageFeedbackView } from '@cvt/components/MessageFeedbackView';

import { routes } from '@shared/routes';

import { useCompanyCrud } from '../hooks/useCompanyCrud';
import { CompanyForm } from '../partials/CompanyForm';
import { useCompany } from '../hooks/useCompany';


const EditCompanyView: React.FC<Companies.Company> = (company) => {

  const navigate = useNavigate();
  const { asyncConfirmation } = React.useContext(DialogContext);
  const { dictionary } = React.useContext(LocalizationContext);

  const { editCompany, deleteCompany } = useCompanyCrud();

  const onSubmit = React.useCallback((data: Companies.Crud) => {
    if (!company) {
      return false;
    }
    return editCompany({
      ...data,
      id: company.id,
    });
  }, [company, editCompany]);

  const onDelete = React.useCallback(async () => {
    const userConfirmed = await asyncConfirmation({ title: dictionary.companies.edit.deleteConfirmation });
    if (!company || !userConfirmed) {
      return false;
    }
    return deleteCompany(company.id).then(() => {
      navigate(routes.companies.list);
    });
  }, [company, deleteCompany, asyncConfirmation, dictionary, navigate]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1">{company.name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Box p={4} component={Paper}>
              <CompanyForm
                defaultValues={{
                  ...company,
                  primaryContact: null,
                }}
                onSubmitRequest={onSubmit}
                onSubmitButtonText={dictionary.forms.buttonEdit}
                fieldFilters={{
                  primaryContact: {
                    company: company.id,
                  },
                }}
              />
            </Box>
            <Box mt={2}/>
            <Button
              onClick={onDelete}
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<Delete/>}
            >
              {dictionary.companies.edit.buttonDelete}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

interface Props {
  companyId: number;
}

export const EditCompany: React.FC<Props> = ({ companyId }) => {

  const { company, status } = useCompany({
    id: companyId,
  });

  if (status === 'error') {
    return <MessageFeedbackView height="100vh" />;
  }

  return (
    <React.Fragment>
      {status !== 'success' || !company ? (
        <BodyLoading height="100vh"/>
      ) : (
        <EditCompanyView {...company} />
      )}
    </React.Fragment>
  );
};