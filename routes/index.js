var express = require('express');
var router = express.Router();
var twilio = require('twilio');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/sms', function(req, res) {
  console.log("SMS received");

  var resp = new twilio.TwimlResponse();
  resp.say('ok there');
  console.log(resp.toString());
  res.send("ok");
})

module.exports = router;
