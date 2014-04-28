var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var client = new twilio.RestClient();
var redis = require('redis-url').connect(process.env.REDISTOGO_URL);
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res) {
  // get current bacon status
  redis.lrange("status", "0", "-1", function(err, values) {
    var updates = [];
    values.forEach(function(value, i) {
      update = JSON.parse(value);
      update.pretty_date = moment(update.date).fromNow();
      updates.push(update);
    })
    res.render('index', { title: 'Bacon Status', 
                          updates: updates,
                        });
  })
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
          say(from, 'You are now baconized. Say "bye" to quit.');
        } else {
          console.log("Error adding user to redis");
        }
      })
    } else {
      console.log(from + " is a member, parsing body");
      if(body.toLowerCase()=="stop" || body.toLowerCase()=="bye") {
        redis.srem("kir", from, function(err, values) {
          if(!err) {
            console.log("Removing " + from);
            say(from, 'De-beconized.'); // might not send because stop already blocks
          } else {
            console.log("DB error removing " + from);
          }
        })
      } else {
        console.log("Logging bacon status: " + body);
        bacon_status = {date: new Date(), status: body};
        redis.lpush("status", JSON.stringify(bacon_status), function(err, values) {
          if(err) {
            console.log("DB error adding status");
          }
        })
      }
    }
  })

  res.end();
})

function say(to, body) {
  client.sendSms({
      to: to,
      from: '12065382935',
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
