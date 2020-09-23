require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { json } = require('body-parser');
const { response } = require('express');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => res.sendFile(__dirname + "/signup.html"));

app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // Preparation of data to send to
    // MailChimp server
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }

    // convert the data into a json format
    const jsonData = JSON.stringify(data);

    const options = {
        method: 'POST',
        auth: process.env.API_KEY
    }


    // Make the request
    /*
    We wrap the request function into a function
    (That convert the data into a javascript object)
    */
    const request = https.request(process.env.LIST_ID, options, (response) => {
        const httpStatusCode = response.statusCode;


        // check for http status code
        if (httpStatusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        // response.on("data", (data) =>{
        //     console.log(JSON.parse(data));
        // }); for testing purpose
    });

    request.write(jsonData);    // Then we send this request on MailChimp server
    request.end();

});


// if request isn't successful
app.post('/failure', (req, res) =>{
    res.redirect('/'); // redirect to home route
});

// request successful
app.post('/success', (req, res) => {
    res.redirect('/');
});

// we use port 3000 locally for testing
// 'port' is assigned automatically by Heroku server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Our server is running on port ${ PORT }`));