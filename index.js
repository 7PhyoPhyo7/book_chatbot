'use strict';

// Imports dependencies and set up http server
	const
	requestify=require('requestify'),
	express = require('express'),
	bodyParser = require('body-parser'),
	 request = require('request'),
  	ejs = require("ejs"),
 	fs = require('fs'),
	PAGE_ACCESS_TOKEN=process.env.PAGE_ACCESS_TOKEN,
	app = express().use(bodyParser.json()); // creates express http server 
	const sendmessageurl='https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN
	
	
var admin = require("firebase-admin");

var serviceAccount = {
   "type": "service_account",
  "project_id": "bookchatbot-bade6",
  "private_key_id": "043ddd1fcb47be78d0dde3796416e83228caa583",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCUYAmomeYlUECP\nWqU0oSGQKHcUJBSUKa7XaI9Pl9ILiY/a8kTVIY8+3xM/eqXCwh5NhOzer7qlckHO\n+lLQQnb6j/Uy1N5b4asGGveju2ce8ZbI3FQUTbWZ4IlR5FUSHeUdnLRsY0ajn6Bq\nsei4D+nnIlW1WIIDlCOgIdDXbuCt9d7JTD1iY5+94WypWUIx7QSwblK3jhjmzUUk\n37Z7992hPhlBbzo4P8N2me63RfLETm4Vy0nEzbebYEUkul1buX1AeUmjKDlANg9u\nbnBeqUS/3+CYgQcIFNB6HQRaa4fQvn7WWlrxNMgexzVOs4v5QJGEuQk6QdsR3EoK\nO8ob6szhAgMBAAECggEARRerp71ytHF4fsjhIW7fKDgPq2tZwdzfNCPWiGPURdcb\nDAPBFdZ40/ghCHBefCDU55g8jT4blitshat/oMcyjF84+SCzIuolL8SjCLWdwYUS\niBpBdOry4+LxTxcankMZi/6K7eYU4ODWXJjYG84dR6pvavD6Khxzsn/MtmVFbvvX\n7N4tFIGZBKjQ/3Ecy/Nx5XsOyzn0buv49YqYsjMBrnFiOEA3F6lfJRH56fvwYpRD\nTksxlq4hT8ma87LzoXF5DK6GBOLM6lFBr+zKQRpM8XPApZeMXCcUksob3z/H5zBx\nxngY3Oa+Z4nwYug+K2z9T8QbVC+QNVpr6f8/wQBROQKBgQDD6yl3jn/8seg2yR5p\nMh6U1dBwuqkTM6KbFB3yicYc5EcY+Z8Tsrx7iw5x283rTmxFLWltR0XSMCIkoqaw\nZttywc5O2qdyaWupYlWPjlhrwFau2Mm9B4Q3J12pKD9y6S2QHzfD+8RcjHaA0koo\nHP5zo4gY1S8YrDsvWmrQ+3TNawKBgQDB4Gqpnq8HPJyA82NlR4rxxGVgJf3wXnTN\nhPD1AxddGrBdS5FGne+rlqTYpP7HXjjytqJi9X0XhAO8o/vkN3IpLbj3O0Av3s7+\n15TKnmIClyTIgyqMH3BubPKJihYk/EyxQOzxRxRJbZIefh4el0uOVFYkJjxpzowb\nCRxFNVS14wKBgQCzXPTOttAnqTyeA4xq5G6o9gLpYYpuwOQKM+Wi6U1NoBQTIlzn\nrMfwFwO3a3NfDKIExylw2UJrxpNLlPkkIFah/hqBiJ6qGSduoE8SqU/7/c+eLWys\nOVhrIggWWHmWGzIScvIb48AGtrW7BErN5JVzivCLQ4jlfrCEjrOh9cQeVwKBgQCI\n1EbTEWA7/kYCKEQ1HYntWYumkQmolDFhPvsEILtjhUuFfKi6KwsUkcwj7ka2FESi\n38y5hMJVT2GHyEAlcBBNCazqJ9IENv7mEuY7Hg7T/zIBpbjojeO+u3ttIJzCW6IQ\n016mZmDl9cPTa3T8aBD2EYV+G9I1ZoWxKvvdyGbRuwKBgHdjhy5XB7cau/t4FxSh\nGOhldpAWY9LTGDWbShQzlOxkPDMx9QgfOSfGlF9rtBVtyNTl1o0vh8kZXqCVwM7z\no2cwSGZwYOmtFDAkl0qisoZ3v2q5jC7WEo56BAXR1C6e5jIoxb8SFQPEavBZ2qZt\npMLvOKROB8ktcLZJBFN46PEx\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-vq413@bookchatbot-bade6.iam.gserviceaccount.com",
  "client_id": "117551871298702231336",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vq413%40bookchatbot-bade6.iam.gserviceaccount.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bookchatbot-bade6.firebaseio.com"
});

const db = admin.firestore()

	requestify.post('https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+PAGE_ACCESS_TOKEN,
		{"get_started":{"payload":"Hi"},  
  "greeting": [
    {
      "locale":"default",
      "text":"Hello {{user_first_name}}! \nWe provide service!!" 
    }
  ]

}).then(function(success) {
	console.log('persistent_menu.success');
	// body...
})

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.get('/', (req, res)=>{
	res.send("Hello vro!");
})



// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFICATION_TOKEN;
   
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
   	   res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function textMessage(senderID,text){
	requestify.post(sendmessageurl, {
		"recipient":{
		"id":senderID},
		"message":{
			"text":text
		}
	})
}

app.post('/admin', (req, res) => {
	var userInput = req.body.userInput
	var senderID = req.body.senderID
	if(userInput == 'Hi'){
		textMessage(senderID,'Welcome Admin')
	}
})

app.post('/advisor', (req, res) => {
	var userInput = req.body.userInput
	var senderID = req.body.senderID
	if(userInput == 'Hi'){
		textMessage(senderID,'Welcome Advisor')
	}
})

app.post('/user', (req, res) => {
	var userInput = req.body.userInput
	var senderID = req.body.senderID
	if(userInput == 'Hi'){
		textMessage(senderID,'Welcome User')
	}
})

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      var senderID=webhook_event.sender.id;
      console.log('senderID',senderID);
      if(webhook_event.postback){
      	var userInput=webhook_event.postback.payload;
    }
    if (webhook_event.message) {if (webhook_event.message.text) {
    	var userInput=webhook_event.message.text;
    }
	if (webhook_event.message.attachments){
		var userMedia=webhook_event.message.attachments.payload.url;

	}}
	 
		db.collection('admin').where('id','==',`${senderID}`).get().then(adminList => {
			if(adminList.empty){
				db.collection('BookAdvisor').where('id','==',`${senderID}`).get().then(advisorList => {
					if(advisorList.empty){
						requestify.post('https://bookchatbot.herokuapp.com/user', {
							userInput: userInput || null,
							senderID: senderID
						})
					}else{
						requestify.post('https://bookchatbot.herokuapp.com/advisor', {
							userInput: userInput || null,
							senderID: senderID,
							video: userMedia
						})
					}
				})
			}else{
				requestify.post('https://bookchatbot.herokuapp.com/admin', {
					userInput: userInput || null,
					senderID: senderID,
					image: userMedia
				})
			}
		})
	 
	
  
  
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
     } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});






