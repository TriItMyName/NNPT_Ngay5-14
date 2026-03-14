var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    status: 'ok',
    service: 'NNPT_Ngay5-14',
    message: 'server is running'
  });
});

module.exports = router;
