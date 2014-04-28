var express = require('express');
var router = express.Router();
var twilio = require('twilio');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/sms', function(req, res) {
  console.log("SMS received");
  console.log(req.toString());

  var resp = new twilio.TwimlResponse();
  resp.say('got it');
  console.log(resp.toString());
  res.send(resp.toString());
})

module.exports = router;
