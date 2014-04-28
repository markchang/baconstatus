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
  console.log('From' + req.param('From'));
  console.log('MessageSID' + req.param('MessageSid'));
  console.log('Body' + req.param('Body'));
  res.end();
})

module.exports = router;
