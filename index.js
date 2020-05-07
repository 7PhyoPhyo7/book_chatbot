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
	const sendmessageurl='https://graph.facebook.com/v6.0/me/messages?access_token='+PAGE_ACCESS_TOKEN
	
app.use(express.static('public'));
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', __dirname+'/public');
// database setup
var newregister='';
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

const db = admin.firestore();



//get_started and greeting 

	requestify.post('https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+PAGE_ACCESS_TOKEN,
		{
			"get_started":{"payload":"Hi"},  
  			
  			"greeting": [
			    {
			      "locale":"default",
			      "text":"Hello {{user_first_name}}! \nWe provide service!!" 
	   			}
  			]

		}
	)


// Sets server port and logs message on success

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));



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



// Creates the endpoint for our webhook 

app.post('/webhook', (req, res) => {  
 
  let body = req.body;
  let isreviewer = true;
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
      if(webhook_event.postback)
      {
      	var userInput=webhook_event.postback.payload;
    	}
      if (webhook_event.message) 
      {
	    		if (webhook_event.message.text) 
	    		{
	    			var userMessage=webhook_event.message.text;
	    		}
				if (webhook_event.message.attachments)
				{
					var userMedia=webhook_event.message.attachments.payload;
				}
				if(webhook_event.message.quick_reply)
				{
					var userQuickreply=webhook_event.message.quick_reply.payload;
				}
		}
	    
		db.collection('admin').where('adminid','==',`${senderID}`).get().then(adminList => {
			if(adminList.empty)
			{
				db.collection("bookshopowner").where('ownerid','==',`${senderID}`).get().then(bookshopownerlist => {
					if(bookshopownerlist.empty)
					{
						db.collection("user").where('userid','==',`${senderID}`).where('isreviewer','==',`${isreviewer}`).get().then(reviewerlist=>{
							if(reviewerlist.empty)
							{
								db.collection("user").where('userid','==',`${senderID}`).get().then(userlist => {
									if(userlist.empty)
									{
                        if(userInput == 'Hi')
										   {
										   	//textMessage(senderID,"Welcome New User");
                           QuickReplyNewUser(senderID);
                                        
										   }
                       if(userQuickreply == 'seller')
                       {
                        db.collection('bookshopowner').add({
                              ownerid:senderID
                        }).then(own=>{
                              textMessage(senderID,"Register Successful");
                              textMessage(senderID,"Please type 'Login' to start Process");
                        })
                       }
                       if(userQuickreply == 'reader')
                       {
                        textMessage(senderID,"Please type 'Register' ");
                        newregister ='reader';
                       }
                       if(newregister == 'reader')
                       {
                          if(userMessage == 'Register')
                          {
                             UserRegister(senderID,userMessage);
                             newregister='';
                          }
                       }

									}
									else
									{
                             if(userInput == 'Hi')
										   {
										   	textMessage(senderID,"Welcome User");
										   }
									}
								})	
							}
							else
							{
								if(userInput == 'Hi')
								   {
								   	textMessage(senderID,"Welcome Reviewer");
								   }
							}
						})

								
					}
					else
					{
              console.log('USER INPUT -> ', userInput);
							if(userInput == 'Hi')
						   {					   
						    QuickReplyMenu(senderID);
						   }
						   if(userQuickreply == 'menu')
						   {
						   	BookshopMenu(senderID);
						   }
						   if(userInput == 'booklist')
						   {
						   	 Get_BookList(senderID)
                    .then(() => QuickReplyMenu(senderID));                
						   }
               if(userMessage == 'Login')
               {
                  QuickReplyMenu(senderID);
               }
               if (userInput !== undefined && userInput.includes('book_detail'))
               {
                      
                      // let result = userInput.substring(12);
                      // console.log("substring",result);
                      var bookdetail = userInput.split('#');
                      var author=bookdetail[2];
                      var bookname=bookdetail[1];
                      console.log("Author",author);
                      console.log("Bookname",bookname);
                      console.log("SenderID",senderID);
                   db.collection('book').doc(bookname).collection('bookshop').get().then(bookshoplist=>{
                    bookshoplist.forEach((doc)=>{
                      if(doc.data().ownerid == senderID)
                      {
                          MessageDetail(senderID,"Book Name",bookname).then(() => {
                            MessageDetail(senderID,"Author",author).then(() => {
                              MessageDetail(senderID,"Stock",doc.data().stock).then(() => {
                                MessageDetail(senderID,"Book Shop Address",doc.data().bookshopaddress).then(() => {
                                  MessageDetail(senderID,"Book Shop Phone",doc.data().bookshopphno).then(() => {
                                    MessageDetail(senderID,"Page Link",doc.data().link);
                                  })
                                })
                              })
                            })
                          })                        
                      }
                    })
                   })
                      
                      
              }
					}
				})
			}
			
			else
			{
				requestify.post("https://graph.facebook.com/v6.0/me/custom_user_settings?psid="+senderID+"&access_token="+PAGE_ACCESS_TOKEN,
                                      {
                                      "persistent_menu":[
                                      {
                                        "locale":"default",
                                        "composer_input_disabled":false,
                                        "call_to_actions":[
                                        {
                                            "type":"postback",
											"title":"Reviewer Applicant List",
											"payload":"applicant"
                                        }
                                      ]

                                    }
                                   ]

                                  }).then(function(success) {
                                    console.log('New User Persistent_menu.success');
                                    // body...
                                  })
			   if(userInput == 'Hi')
			   {
			   	textMessage(senderID,"Welcome Admin");

			   }	
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
//app
app.get('/register_books/:sender_id',function(req,res){
  const sender_id = req.params.sender_id;
    res.render('testing.ejs',{ title:"Please Register Books", sender_id:sender_id});
});

// app.get('/add-whitelist', (req, res) => {
//   whitelistDomains(res);
// });

app.post('/register_books', async (req,res)=> {
  let author = req.body.author;
  let bookname = req.body.bookname;
  let bookshopname = req.body.bookshopname;
  let sender = req.body.sender; 
  let image = req.body.image;
  let bookshopaddress = req.body.bookshopaddress;
  let bookshopphno = req.body.bookshopphno;
  let link = req.body.link;
  let stock = req.body.stock;
  let knowledge='';
  let romance= '';
  let history= '';
  let biography= '';
  let religion = '';
  var genre=[];
  
 
	  if(req.body.knowledge)
	  {
	           knowledge = req.body.knowledge;
	           genre.push(knowledge);
	  }
	  if(req.body.romance)
	  {
	  	        romance = req.body.romance;
	  	        genre.push(romance);
	  }
	  if(req.body.religion)
	  {
	  	       religion = req.body.religion;
	  	       genre.push(romance);
	  }
	  if(req.body.history)
	  {
	  	       history = req.body.history;
	  	       genre.push(history);
	  }
	  if(req.body.biography)
	  {
	  	         biography =req.body.biography; 
	  	         genre.push(biography);
	  }
  
   await db.collection("book").get()
    .then(booknamelist=>{

      // await Promise.all(
      //   booknamelist.map(
      //     doc => {
      //       return db.collection... set
      //     }
      //   ) // Promise[]
      // );


   	   booknamelist.forEach(doc=>{
   	   	 if(doc.id == bookname)
   	   	 {
              db.collection("book").doc(bookname).collection("bookshop").doc(bookshopname).set({
            	bookshopaddress:bookshopaddress,
            	bookshopphno:bookshopphno,
            	link:link,
            	ownerid:sender,
            	stock:stock
            })
   	   	 }
   	   	 else
   	   	 {
   	   	 	db.collection("book").doc(bookname).set(
   	   	 	{
               author:author,
               genre:genre,
               image:image
            })
            db.collection("book").doc(bookname).collection("bookshop").doc(bookshopname).set({
            	bookshopaddress:bookshopaddress,
            	bookshopphno:bookshopphno,
            	link:link,
            	ownerid:sender,
            	stock:stock
            }).then(oki=>{
              textMessage(senderID,"Register Successful");
            })

   	   	 }
   	   })
   }).then(ok=>{
       textMessage(senderID,"Register Successful!");
   })

  // send, sendFile, redirect
  res.redirect('https://www.messenger.com/closeWindow');
})





app.get('/edit_book/:sender_id/:bookname/:author',function(req,res)
{
  const sender_id = req.params.sender_id;
  const bookname = req.params.bookname;
  const author = req.params.author;
 var bookshopname ='';
 var bookshopaddress='';
 var bookshopphno='';
 var stock='';
 var link='';

   db.collection('book').doc(bookname).collection('bookshop').get().then(bookshopdetail=>{
    bookshopdetail.forEach(doc=>{
                if(doc.data().ownerid == sender_id)
                {
                bookshopname = doc.id;
                bookshopaddress = doc.data().bookshopaddress;
                bookshopphno = doc.data().bookshopphno;
                stock =doc.data().stock;
                link = doc.data().link;
                }
    })
       console.log("Bookshopname",bookshopname);
       res.render('edit_book.ejs',{title: "Please Modify following book",sender_id:sender_id,bookname:bookname,author:author,bookshopname:bookshopname,bookshopaddress:bookshopaddress,bookshopphno:bookshopphno,link:link,stock:stock});
   })

})


app.post('/edit_book',(req,res)=>
{
  console.log("received");
  let bookname = req.body.bookname;
  let bookshopname  = req.body.bookshopname;
  let sender=  req.body.sender;
  let author = req.body.author;
  let bookshopaddress = req.body.bookshopaddress;
  let bookshopphno = req.body.bookshopphno;
  let stock = req.body.stock;
  let link = req.body.link;

      db.collection('book').doc(bookname).collection('bookshop').doc(bookshopname).set({
            bookshopaddress:bookshopaddress,
            bookshopphno:bookshopphno,
            stock:stock,
            link:link,
            ownerid:sender
      }).then(success => {             
             textMessage(sender,"Update Successful");  
             res.status(200).send("Update Successful and Please go back to your messages and please check your book detail");
            // window.location.assign('https://www.messenger.com/closeWindow/?image_url=https://secure.i.telegraph.co.uk/multimedia/archive/03058/thankyou-interest_3058089c.jpg&display_text=Thanks');
          }).catch(error => {
            console.log(error);
      })

  })





   app.get('/register_user/:sender_id',function(req,res){
  const sender_id = req.params.sender_id;
   db.collection("user").where('userid','==',`${sender_id}`).get().then(userlist=>{
    if(userlist.empty)
    {
      res.render('register_user.ejs',{ title:"Please Register User", sender_id:sender_id});
    }
    else
    {
      textMessage(senderID,"Already Register!");
    }
   })
    
});


app.post('/register_user', (req,res)=> {
  let email = req.body.email; 
  let sender = req.body.sender;
  let isreviewer = false;
  var genre=[];

  
   
    if(req.body.knowledge)
    {
            var knowledge = req.body.knowledge;
             genre.push(knowledge);
    }
    if(req.body.romance)
    {
             var romance = req.body.romance;
              genre.push(romance);
    }
    if(req.body.religion)
    {
            var religion = req.body.religion;
             genre.push(romance);
    }
    if(req.body.history)
    {
            var history = req.body.history;
             genre.push(history);
    }
    if(req.body.biography)
    {
             var  biography =req.body.biography; 
               genre.push(biography);
    }
console.log("Gerence",genre);
  

///
  // requestify

  // res.render('success.ejs', {}); TODO: show success page


   db.collection('user').add({
            email:email,
            hobby:genre,
            isreviewer:isreviewer,
            userid:sender
          }).then(success => {             
             textMessage(sender,"User Register Successful");  
             
            // window.location.assign('https://www.messenger.com/closeWindow/?image_url=https://secure.i.telegraph.co.uk/multimedia/archive/03058/thankyou-interest_3058089c.jpg&display_text=Thanks');
          }).catch(error => {
            console.log(error);
      });
   res.redirect('https://www.messenger.com/closeWindow');
})

//Function
function textMessage(senderID,text){
	requestify.post(sendmessageurl, {
		"recipient":{
		"id":senderID},
		"message":{
			"text":text
		}
	})
}

function QuickReplyMenu(senderID)
{
  return requestify.post(sendmessageurl,
   {  
      "recipient":{
        "id":senderID
  },
  
  "message":{
      "text": "Welcome Book Seller",
       "quick_replies":[
      {
        "content_type":"text",
        "title":"Menu",
        "payload":"menu" 
      }
    ]
  }
  }).then(result=>{ console.log("ok")
      }).catch(err=>{console.log("err",err)})
}

function QuickReplyNewUser(senderID)
{
  requestify.post(sendmessageurl,
   {  
      "recipient":{
        "id":senderID
  },
  
  "message":{
      "text": "Please choose Reader or Book Seller",
       "quick_replies":[
      {
        "content_type":"text",
        "title":"Reader",
        "payload":"reader" 
      },
      {
        "content_type":"text",
        "title":"Book Seller",
        "payload":"seller" 
      }

    ]
  }
  }).then(result=>{ console.log("ok")
      }).catch(err=>{console.log("err",err)})
}


 function MessageDetail(senderID,prefix,text)
 {
  console.log('MESSENGER_DETAIL');
  return requestify.post(sendmessageurl, {
    "recipient":{
    "id":senderID},
    "message":{
      "text":prefix+" : "+text
    }
  })
 }

 function BookshopMenu(senderID){
 requestify.post(sendmessageurl,
  {
    "recipient":{
      "id":senderID
    },
  "message":{
   "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":"Menu",
              "subtitle":"Choose One Menu",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://bookchatbot.herokuapp.com/register_books/"+senderID,
                    "title":"Register Books",
                    "webview_height_ratio": "full"
                  },
                  {
                    "type":"postback",
                    "title":"Books List",
                    "payload" : "booklist"
                  },
               ]}

        ]
      }
    }
  }
  }) 
  console.log('button_sender',senderID);
}

 function Get_BookList(senderID)
  {
  
  	let bookdetail=[];
  	   
      return db.collection('book').where('owner', 'array-contains', senderID).get().then(async (booklist)=>{
         booklist.forEach(doc=>{
          let data = {
            "title":"BookName : "+doc.id,
            "subtitle":"Author : "+doc.data().author,
            "image_url":doc.data().image,
              "buttons":[
              {
                    "type":"postback",
                    "title":"Book Detail",
                    "payload":`book_detail#${doc.id}#${doc.data().author}`
              },
              {
                    "type":"web_url",
                    "url":"https://bookchatbot.herokuapp.com/edit_book/"+senderID+"/"+doc.id+"/"+doc.data().author,
                    "title":"Edit Books",
                    "webview_height_ratio": "full"
                  },

             ]}
           
             bookdetail.push(data)
                        
         })

        await requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
                        {
                          "recipient":{
                          "id":senderID
                        },
                        "message":{
                          "attachment":{
                            "type":"template",
                            "payload":{
                              "template_type":"generic",
                              "elements":bookdetail
                          }
                        }
                      }
                        }).catch((err) => {
                          console.log('Error getting documents', err);
                        }); 
      })


  }

  function UserRegister(senderID,userMessage)
  {
    requestify.post(sendmessageurl,
  {
    "recipient":{
      "id":senderID
    },
  "message":{
   "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":"Please Click Register",
              "subtitle":"",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://bookchatbot.herokuapp.com/register_user/"+senderID,
                    "title":"Register",
                    "webview_height_ratio": "full"
                  }
               ]}

        ]
      }
    }
  }
  }) 
  console.log('button_sender',senderID);
  }

// function whitelistDomains(res) {
//   var messageData = {
//           "whitelisted_domains": [
//             'https://bookchatbot.herokuapp.com'         
//           ]               
//   };
//   request({
//       url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       form: messageData
//   },
//   function (error, response, body) {
//       if (!error && response.statusCode == 200) {          
//           res.send(body);
//       } else {           
//           res.send(body);
//       }
//   });
// } 

