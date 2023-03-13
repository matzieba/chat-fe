import { AxiosResponse } from 'axios';

import { DEFAULT_QUERY_LIMIT } from '@cvt/helpers/query';
import { camelizeObject, snakizeObject } from '@cvt/helpers/object';
import { request } from '@cvt/clients/baseClient';

const companiesApiBaseUrl = import.meta.env.VITE__CVT_API_URL;

const getCompanies = (params: Companies.GetListParams): Promise<AxiosResponse<CVT.Query.PaginatedResults<Companies.Company>>> => {
  return request({
    options: {
      url: `${companiesApiBaseUrl}/companies/`,
      method: 'GET',
      params: {
        search: params.search,
        limit: params.limit || DEFAULT_QUERY_LIMIT,
        offset: params.offset,
      },
    },
  }).then((data: AxiosResponse<CVT.Query.PaginatedResults<Companies.CompanyApi>>) => ({
    ...data,
    data: {
      ...data.data,
      results: data.data.results.map(camelizeObject<Companies.Company>),
    },
  }));
};

const getCompany = (params: { id: number | string }): Promise<AxiosResponse<Companies.Company>> => {
  return request({
    options: {
      url: `${companiesApiBaseUrl}/companies/${params.id}/`,
      method: 'GET',
    },
  }).then((data: AxiosResponse<Companies.CompanyApi>) => ({
    ...data,
    data: camelizeObject<Companies.Company>(data.data),
  }));
};

const createCompany = (data: Companies.Create): Promise<AxiosResponse<Companies.Company>> => {
  return request({
    options: {
      url: `${companiesApiBaseUrl}/companies/`,
      method: 'POST',
      data: snakizeObject<Companies.CompanyApi>(data),
    },
  });
};

const editCompany = (data: Companies.Edit): Promise<AxiosResponse<Companies.Company>> => {
  return request({
    options: {
      url: `${companiesApiBaseUrl}/companies/${data.id}/`,
      method: 'PUT',
      data: snakizeObject<Companies.CompanyApi>(data),
    },
  });
};

const deleteCompany = (params: { id: number | string }): Promise<AxiosResponse> => {
  return request({
    options: {
      url: `${companiesApiBaseUrl}/companies/${params.id}/`,
      method: 'DELETE',
    },
  });
};

export const companyClient = {
  getCompanies,
  getCompany,
  createCompany,
  editCompany,
  deleteCompany,
};
