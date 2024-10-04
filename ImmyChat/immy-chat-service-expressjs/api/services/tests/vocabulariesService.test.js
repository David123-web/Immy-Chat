const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { fetchVocabulary } = require('../vocabulariesService');
const { getApiConfig } = require('../../../config/apiConfig');

describe('fetchVocabulary', () => {
    let mockAxios;
  
    beforeEach(() => {
      mockAxios = new MockAdapter(axios);
    });
  
    afterEach(() => {
      mockAxios.restore();
    });
  
    test('returns vocabulary when request is successful', async () => {
      const lessonId = '123';
      const vocabularyData = [{ value: 'word1' }, { value: 'word2' }];
      const expectedVocabulary = ['word1', 'word2'];
  
      const endpoint = 'vocabularies/immy';
      const params = { lessonId };
      const config = getApiConfig(endpoint, 'get', params);
  
      mockAxios.onGet(config.url, { params }).reply(200, vocabularyData);
  
      const result = await fetchVocabulary(lessonId);
      expect(result).toEqual(expectedVocabulary);
    });
  
    test('throws error when request fails', async () => {
      const lessonId = '123';
      const errorMessage = 'Request failed with status code 500';
  
      const endpoint = 'vocabularies/immy';
      const params = { lessonId };
      const config = getApiConfig(endpoint, 'get', params);
  
      mockAxios.onGet(config.url, { params }).reply(500);
  
      await expect(fetchVocabulary(lessonId)).rejects.toThrowError(errorMessage);
    });
  });