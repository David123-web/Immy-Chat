const apiConfig = {
  headers: {
    'Authorization': `${generateBasicAuth(process.env.API_USERNAME, process.env.API_PASSWORD)}`
  }
};

function getApiConfig(endpoint = '', method, params) {
  apiConfig.method = method;
  apiConfig.url = `${process.env.IMMERSIO_BE_BASE_URL}/${endpoint}`;
  apiConfig.params = params;
  return apiConfig;
}

function generateBasicAuth(username, password) {
  const credentials = `${username}:${password}`;
  const hashedCredentials = Buffer.from(credentials).toString('base64');
  return `Basic ${hashedCredentials}`;
}

module.exports = {
  getApiConfig,
};
