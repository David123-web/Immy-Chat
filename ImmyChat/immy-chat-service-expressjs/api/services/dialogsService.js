const axios = require('axios');
const { getApiConfig } = require('../../config/apiConfig');

async function fetchDialogLines(lessonId) {
    try {
      const params = {
        lessonId: lessonId
      };
      const endpoint = 'dialog-lines/immy';
      const method = 'get';
      const config = getApiConfig(endpoint, method, params);
      const response = await axios(config);
      console.log(response);
      return response.data.map(obj => obj.content);
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  async function fetchDialogs(lessonId) {
    try {
      const params = {
        lessonId: lessonId
      };
      const endpoint = 'dialogs/immy';
      const method = 'get';
      const config = getApiConfig(endpoint, method, params);
      const response = await axios(config);
      console.log(response);
      return response.data.map(obj => obj.context);
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }


module.exports = {
    fetchDialogLines,
    fetchDialogs
};