import fetchFromApiServer from "@/services";

// Register company API
export const registerCompanyApi = async (data) => {
  const url = `api/v1/company/register`;
  return await fetchFromApiServer("POST", url, data);
};

// Get all companies for the logged-in user API
export const getCompaniesApi = async () => {
  const url = `api/v1/company/get`;
  return await fetchFromApiServer("GET", url);
};

// Get a company by ID API
export const getCompanyByIdApi = async (companyId) => {
  const url = `api/v1/company/get/${companyId}`;
  return await fetchFromApiServer("GET", url);
};

export const getJobsByCompanyApi = async(companyId)=>{
  const url = `api/v1/company/getJob/${companyId}`;
  return await fetchFromApiServer('GET',url);
}

// Update company API
export const updateCompanyApi = async (companyId, formData) => {
  const url = `api/v1/company/update/${companyId}`;
  return await fetchFromApiServer("PUT", url, formData);
};

// Delete company API
export const deleteCompanyApi = async (companyId) => {
  const url = `api/v1/company/delete/${companyId}`;
  return await fetchFromApiServer("DELETE", url);
};
