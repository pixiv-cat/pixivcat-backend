function validateIllustId(req, res, next) {
    const illustId = req.params.illustId;
    // Check if the illustId contains only digits
    if (/^([1-9][0-9]*)$/.test(illustId)) {
      next();
    } else {
      res.status(400).render('error', {
        error_title: '400 Bad Request',
        message_en: 'Invalid ID format.',
        message_zh: '無效的ID格式。',
      });
    }
};

function validatePageNumber(req, res, next) {
    const pageNumber = req.params.pageNumber;
    // Check if the pageNumber contains only digits and is greater than 0
    if (/^\d+$/.test(pageNumber) && pageNumber > 0) {
      next();
    } else {
      res.status(400).render('error', {
        error_title: '400 Bad Request',
        message_en: 'Invalid page number.',
        message_zh: '無效的頁數。',
      });
    }
};

function validateExtension(req, res, next) {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const fileExtension = req.params.fileExtension.toLowerCase();

  // Check if the file extension is valid
  if (allowedExtensions.includes(fileExtension)) {
    next();
  } else {
    res.status(400).render('error', {
      error_title: '400 Bad Request',
      message_en: 'Invalid file extension.',
      message_zh: '無效的檔案副檔名。',
    });
  }
};

module.exports = {
    validateIllustId,
    validatePageNumber,
    validateExtension,
};