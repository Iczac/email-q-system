const express = require('express')
const app = express()
const Queue = require('bee-queue');
const queue = new Queue('email');
const moment = require('moment')
const CronJob = require('cron').CronJob;
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Email validation function
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/* Consider this as a Database to Store incoming Jobs */
global.data_base = []

/* Valid Requests */ 
global.services = [
    'confirm', //confirmation email
    'reset_pw' //password reset email
]

/* Express Routes */ 

app.post('/send_email', (req, res)=> {
    let email, email_type;

    // Json Validation
    if (!req.body.email || !req.body.email_type) {
        res.status(400).send({status: "error", msg: "missing_param" })
        return true;
    }

    // Email Validation
    if (!validateEmail(req.body.email)) {
        res.status(400).send({status: "error", msg: "invalid_email_address" })
        return true
    } else {
        email = req.body.email
    }

    // Service Validation
    if (!global.services.includes(req.body.email_type)) {
        res.status(400).send({status: "error", msg: "invalid_service" })
        return true
    } else {
        email_type = req.body.email_type
    }

    // Pushing to Job Database
    data_base.push({
        email: email,
        email_type: email_type
    })

    console.log(`New Job pushed to Queue`)

    res.status(200).send({status: "success", msg: "request_recieved"})
})

app.listen(3000, () => {
    console.log('App listening on port 3000!')
})

/* Queue System */

queue.process(function (job, done) {
    let email_type = job.data.email_type
    let email = job.data.email

    // Sending email based on type
    switch(email_type) {
        case "confirm":
            console.log(`Sending confirmation email to ${email}`)
            return done(null, `Confirmation email sent to ${email}`);
            break;

        case "reset_pw":
            console.log(`Sending Password reset email to ${email}`)
            return done(null, `Password reset email sent to ${email}`);
            break;

        default:
            console.log(`Requested Email Service Not Avaiable`)
            return done(null, "Requested Email Service Not Avaiable");
            break;
    }
    
});

/* Node Cron */ 

// Cron is running every second to execute
new CronJob('* * * * * *', function() {

    // Get data from Database
    let data = global.data_base.shift();
    let email,email_type;

    // Check if Job listing is empty
    if (data === undefined) {
        console.log('No Job to Run')
        return true
    } else {
        email = data.email;
        email_type = data.email_type;
    }

    // Creating a Job
    const job = queue.createJob({email: email, email_type: email_type})
    job.save();

    // Run this on Job Success
    job.on('succeeded', (result) => {
        console.log(`Job result for job ${job.id} => ${result}`);
    });

    // Run this on Job Failure
    job.on('failed', (err) => {
        console.log(`Job ${job.id} failed with error ${err.message}`);
    });

}, null, true, 'Asia/Singapore');