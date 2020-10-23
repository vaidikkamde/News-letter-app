const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.listen(process.env.PORT || 3000, function() {
  console.log("Server Running on port 3000...");
});


app.post("/", function(req, res) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  // Data Object
  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };
  var jsonData = JSON.stringify(data);
  var url = "https://us2.api.mailchimp.com/3.0/lists/cf6f692e49/";
  var options = {
    method: "POST",
    auth: "arjun:45c2eeda51c65fbf680b7eb4f1c3fbb7-us2"
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
      console.log(response.statusCode);
      if (response.statusCode==200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }

    })
  })

  request.write(jsonData);
  request.end();

});
app.post("/failure",function(req,res){
  res.redirect("/");
});

// api key
// 45c2eeda51c65fbf680b7eb4f1c3fbb7-us2
