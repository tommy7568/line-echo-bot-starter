let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let app = express()

const CHANNEL_ACCESS_TOKEN = 'vc8M9NWwvT6NUqegf51p+UblCMZzp5eAALp8lartXvM4ufCqCWII+RYkEkoRALNi4xzzIsyIkA1Sv1hYIukHSufriIanOT0ieDeTU2hHXfmXGUpA2xCEhe7JMEfXWC8FJfaT6jG+ztVu/MVUa3qUUQdB04t89/1O/w1cDnyilFU='
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// handler receiving messages
app.post('/', function (req, res) {
    console.log(JSON.stringify(req.body,null,2))

    let events = req.body.events
    events.forEach((event) => {
        let replayToken = event.replyToken
        let type = event.message.type
        if (type === 'text'){
            let text = event.message.text
            sendMessage(replayToken,type)
        } else {
            sendMessage(replayToken,type)
        }
        
    })
    res.send()
})

// generic function sending messages
function sendMessage(replyToken, text) {
    let body = {
        replyToken,
        messages: [{
            type: 'text',
            text,
        }],
    };

    let options = {
        url: 'https://api.line.me/v2/bot/message/reply',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
        body,
        json: true,
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
