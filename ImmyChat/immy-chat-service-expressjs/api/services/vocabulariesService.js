const axios = require('axios');
const { getApiConfig } = require('../../config/apiConfig');

async function fetchVocabulary(lessonId) {
  try {
    const params = {
      lessonId: lessonId
    };
    const endpoint = 'vocabularies/immy';
    const method = 'get';
    const config = getApiConfig(endpoint, method, params);
    const response = await axios(config);
    return response.data.map(obj => obj.value);
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

module.exports = {
  fetchVocabulary
};