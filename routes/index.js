var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var client = new twilio.RestClient();
var redis = require('redis-url').connect(process.env.REDISTOGO_URL);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/sms_test', function(req,res) {
  console.log("Test SMS received");

  var from = req.param('From');
  var message_sid = req.param('MessageSid');
  var body = req.param('Body');

  console.log("From: " + from + ", body: " + body);

  redis.sismember("kir", from, function(err, values) {
    if(values==0) {
      console.log(from + " is not a member");
      redis.sadd("kir", from, function(err, values) {
        if(!err) {
          console.log("Added " + from + " to user database");
          res.send("Added");
        } else {
          res.send("error");
        }
      })
    } else {
      console.log(from + " is a member, parsing body");
      if(body.toLowerCase()=="stop") {
        redis.srem("kir", from, function(err, values) {
          if(!err) {
            console.log("Removing " + from);
            res.send("Removing you");
          } else {
            console.log("Error removing " + from);
            res.send("Shit");
          }
        })
      } else {
        console.log("Bacon status: " + body);
        res.send("Got status");
      }
    }
  })
})

router.post('/sms', function(req, res) {
  // deets
  console.log("SMS received");

  var from = req.param('From');
  var message_sid = req.param('MessageSid');
  var body = req.param('Body');

  console.log("INCOMING: " + from + ", body: " + body);

  redis.sismember("kir", from, function(err, values) {
    if(values==0) {
      console.log(from + " is not a member");
      redis.sadd("kir", from, function(err, values) {
        if(!err) {
          console.log("Added " + from + " to user database");
          say(from, '12065382935', 'You are now baconized.');
        } else {
          console.log("Error adding user to redis");
        }
      })
    } else {
      console.log(from + " is a member, parsing body");
      if(body.toLowerCase()=="stop") {
        redis.srem("kir", from, function(err, values) {
          if(!err) {
            console.log("Removing " + from);
            // say(from, '12065382935', 'De-beconized.');
            // can't send because stop already blocks
          } else {
            console.log("DB error removing " + from);
          }
        })
      } else {
        console.log("Bacon status: " + body);
      }
    }
  })

  res.end();
})

function say(to, from, body) {
  client.sendSms({
      to: to,
      from: from,
      body: body
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
}

module.exports = router;
