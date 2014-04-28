var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var client = new twilio.RestClient();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/sms', function(req, res) {
  console.log("SMS received");
  console.log(req.param('from'));

  res.end();
})

module.exports = router;
