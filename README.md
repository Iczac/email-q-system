# Email Queue System Implementation

## **Info**
---
#### Implementation of Email Queue System with NodeJS using Libraries.

## Library Used
* <a href="https://expressjs.com/">ExpressJS</a>
* <a href="https://github.com/bee-queue/bee-queue">Bee Queue</a>
* <a href="https://github.com/kelektiv/node-cron">Node Cron</a>

#### As stated on Bee Queue Github <a href="https://github.com/kelektiv/node-cron">Redis 2.8+</a> is needed for BQ to work.

## **Setup Instruction**
---
`git clone https://github.com/Iczac/email-q-system.git`

`cd email-q-system`

`npm install`

#### Open new terminal to setup redis _(If you prefer to read <a href="https://redis.io/topics/quickstart">Official Guide</a>)_

`curl http://download.redis.io/redis-stable.tar.gz --remote-name`

`tar xvzf redis-stable.tar.gz`

`cd redis-stable/src`

`make install`

#### After Redis installation is done,

Type `redis-server` in terminal

If you see `Ready to accept connections`, your Redis is up and running

#### Leave the Redis Running (_Closing terminal will stop the Redis_)

Go back to `email-q-system` terminal.

Type `node index.js` to run Express Server.

By default, it will run on `http://localhost:3000/`

## **System Usage**
---

Once Node Server is up, Cron will be running every second.
_You can change the interval by tweaking `index.js` Look for `Node Cron` keyword_

#### To send a job (_You can either use PostMan or curl_)
`curl -X POST -H "Content-Type: application/json" -d '{"email": "test@email.com", "email_type": "reset_pw"}' http://localhost:3000/send_email`

#### Avaiable Email Request Type (_email_type_)
* `confirm`
* `reset_pw`

Once you have made a request, you can check your Express running terminal to see the messages and result.