const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { fetchPhrases } = require('../phrasesService');
const { getApiConfig } = require('../../../config/apiConfig');

describe('fetchPhrases', () => {
    let mockAxios;
  
    beforeEach(() => {
      mockAxios = new MockAdapter(axios);
    });
  
    afterEach(() => {
      mockAxios.restore();
    });
  
    test('returns phrases when request is successful', async () => {
      const lessonId = '123';
      const phrasesData = [{ value: 'phrase1' }, { value: 'phrase2' }];
      const expectedPhrases = ['phrase1', 'phrase2'];
  
      const endpoint = 'phrases/immy';
      const params = { lessonId };
      const config = getApiConfig(endpoint, 'get', params); 
  
      mockAxios.onGet(config.url, { params }).reply(200, phrasesData); 
  
      const result = await fetchPhrases(lessonId);
      expect(result).toEqual(expectedPhrases);
    });
  
    test('throws error when request fails', async () => {
        const lessonId = '123';
        const errorMessage = 'Request failed with status code 500';
      
        const endpoint = 'phrases/immy';
        const params = { lessonId };
        const config = getApiConfig(endpoint, 'get', params);
      
        mockAxios.onGet(config.url, { params }).reply(500);
      
        await expect(fetchPhrases(lessonId)).rejects.toThrowError(errorMessage);
      });
  });