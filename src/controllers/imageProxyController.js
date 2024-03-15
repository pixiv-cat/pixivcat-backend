const axios = require('axios');
const path = require('path');
const pixivService = require('../services/pixivService');

const imageHeaders = {
  Referer: 'https://www.pixiv.net/',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
};

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'max-age=31536000, public',
};

const pixivApiResponseValidator = (pixivApiResponse) => {
  // General error handling for Pixiv API response
  if ('error' in pixivApiResponse) {
    if (pixivApiResponse.error.user_message === 'ページが見つかりませんでした') {
      return {
        error_title: '404 Not Found',
        message_en: 'This work has been deleted or restricted.',
        message_zh: '這個作品可能已被刪除，或無法取得。',
      };
    }
    return {
      error_title: '404 Not Found',
      message_en: pixivApiResponse.error.user_message,
      message_zh: '',
    };
  }
  if (pixivApiResponse.illust.image_urls.square_medium === 'https://s.pximg.net/common/images/limit_unknown_360.png') {
    return {
      error_title: '404 Not Found',
      message_en: 'This work has been deleted or restricted.',
      message_zh: '這個作品可能已被刪除，或無法取得。',
    };
  }
  return null;
};

const getImageContentType = (fileName) => {
  const extension = path.extname(fileName).toLowerCase();
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream'; // Default to binary data if extension is not recognized
  }
};

const getIllustSingle = async (req, res) => {
  try {
    const pixivApiResponse = await pixivService.getPixivIllustIdData(req.params.illustId);
    const pixivApiResponseValidationResult = pixivApiResponseValidator(pixivApiResponse);
    if (pixivApiResponseValidationResult !== null) {
      res.status(404).render('error', pixivApiResponseValidationResult);
      return;
    }
    if (pixivApiResponse.illust.page_count > 1) {
      // Multi image work, redirect to the first page
      res.redirect(301, `/${req.params.illustId}-1.${req.params.fileExtension}`);
      return;
    }
    const imageURL = pixivApiResponse.illust.meta_single_page.original_image_url;
    const imageResponse = await axios.get(imageURL, {
      headers: imageHeaders,
      responseType: 'stream',
    });
    const imageFilename = imageURL.substring(imageURL.lastIndexOf('/') + 1);
    res.writeHead(200, {
      'Content-Type': getImageContentType(imageFilename),
      'Content-Disposition': `filename="${imageFilename}"`,
      'X-Origin-URL': imageURL,
      'X-Crawl-Date': new Date().toUTCString(),
      ...responseHeaders,
    });
    imageResponse.data.pipe(res, { end: true });
  } catch (error) {
    console.error('Illust proxy controller error:', error);
    if (error.message === 'Pixiv API rate limit exceeded.') {
      res.status(503)
        .header('Retry-After', 60)
        .render('error', {
          error_title: '503 Service Unavailable',
          message_en: 'API rate limit exceeded. Please try again later.',
          message_zh: 'API 請求次數超過限制，請稍後再試。',
        });
    } else {
      res.status(500).render('error', {
        error_title: '500 Internal Server Error',
        message_en: 'Internal Server Error',
        message_zh: '伺服器內部錯誤',
      });
    }
  }
};

const getIllustMulti = async (req, res) => {
  try {
    const pixivApiResponse = await pixivService.getPixivIllustIdData(req.params.illustId);
    const pixivApiResponseValidationResult = pixivApiResponseValidator(pixivApiResponse);
    if (pixivApiResponseValidationResult !== null) {
      res.status(404).render('error', pixivApiResponseValidationResult);
      return;
    }
    if (pixivApiResponse.illust.page_count === 1) {
      res.status(404).render('error', {
        error_title: '404 Not Found',
        message_en: 'This work has only one page. Please remove the page number from the URL.',
        message_zh: '這個作品ID中有只有一張圖片，不需要指定是第幾張圖片。',
      });
      return;
    }
    if (req.params.pageNumber > pixivApiResponse.illust.page_count) {
      res.status(404).render('error', {
        error_title: '404 Not Found',
        message_en: `This work only has ${pixivApiResponse.illust.page_count} pages. Please specify a valid page number.`,
        message_zh: `這個作品只有 ${pixivApiResponse.illust.page_count} 張圖片，請指定正確的頁數。`,
      });
      return;
    }
    const imageURL = pixivApiResponse.illust
      .meta_pages[req.params.pageNumber - 1].image_urls.original;
    const imageResponse = await axios.get(imageURL, {
      headers: imageHeaders,
      responseType: 'stream',
    });
    const imageFilename = imageURL.substring(imageURL.lastIndexOf('/') + 1);
    res.writeHead(200, {
      'Content-Type': getImageContentType(imageFilename),
      'Content-Disposition': `filename="${imageFilename}"`,
      'X-Origin-URL': imageURL,
      'X-Crawl-Date': new Date().toUTCString(),
      ...responseHeaders,
    });
    imageResponse.data.pipe(res, { end: true });
  } catch (error) {
    console.error('Illust proxy controller error:', error);
    if (error.message === 'Pixiv API rate limit exceeded.') {
      res.status(503)
        .header('Retry-After', 60)
        .render('error', {
          error_title: '503 Service Unavailable',
          message_en: 'API rate limit exceeded. Please try again later.',
          message_zh: 'API 請求次數超過限制，請稍後再試。',
        });
    } else {
      res.status(500).render('error', {
        error_title: '500 Internal Server Error',
        message_en: 'Internal Server Error',
        message_zh: '伺服器內部錯誤',
      });
    }
  }
};

module.exports = {
  getIllustSingle,
  getIllustMulti,
};
