const axios = require('axios');
const { getAccessToken, maskHeader } = require('./pixivAuthService');
const memcachedService = require('./memcachedService');

const PIXIV_BASE_URL = 'https://app-api.pixiv.net/v1';

const getPixivIllustIdData = async (illustId, cache = true) => {
  if (cache) {
    const cachedData = await memcachedService.get(illustId);
    if (cachedData) {
      console.log('Using cached Pixiv API data for illust ID:', illustId);
      return cachedData;
    }
  }

  try {
    console.log('Fetching Pixiv API data for illust ID:', illustId);
    const response = await axios.get(`${PIXIV_BASE_URL}/illust/detail?illust_id=${illustId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${await getAccessToken()}`,
        ...maskHeader,
      },
      validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
    });
    if (cache) memcachedService.set(illustId, response.data);
    return response.data;
  } catch (error) {
    if (error.response.status === 403 && error.response.data && error.response.data.error && error.response.data.error.message === 'Rate Limit') {
      // API Rate limit exceeded
      throw new Error('Pixiv API rate limit exceeded.');
    } else {
      // Other errors
      console.error('Pixiv service error:', error);
      throw new Error('Pixiv API request failed');
    }
  }
};

module.exports = {
  getPixivIllustIdData,
};
