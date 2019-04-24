const express = require('express');
const Services = require('../services/fileupload-service');

const router = express.Router();

/*
- POST API method will send the request to, FileUpload Service function,
- and tt will return validate transaction reference number,
- and also validate end balance based on start balance & mutation values.
*/
router.post('/', async (req, res) => {
  try {
    const errorRecords = await Services.FileUpload(req.files.uploadedFile);
    return res.render('upload-success', {
      title: 'Failed Transaction Records',
      values: errorRecords,
    });
  } catch (err) {
    return res.render('upload-success', {
      title: 'Oops Something went wrong',
    });
  }
});

module.exports = router;
