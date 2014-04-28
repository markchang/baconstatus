var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var client = new twilio.RestClient();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/sms', function(req, res) {
  // deets
  console.log("SMS received");

  var from = req.param('From');
  var message_sid = req.param('MessageSid');
  var body = req.param('Body');

  console.log("From: " + from + ", body: " + body);

  client.sendSms({
      to: from,
      from:'12065382935',
      body:'Got it'
  }, function(error, message) {
      if (!error) {
          console.log('Success! The SID for this SMS message is:');
          console.log(message.sid);
          console.log('Message sent on:');
          console.log(message.dateCreated);
      } else {
          console.log('Oops! There was an error sending a response.');
      }
  });

  res.end();
})

module.exports = router;
