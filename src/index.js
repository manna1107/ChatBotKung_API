const express = require('express')
// will use this later to send requests
const http = require('http')
// import env variables
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).send('Server is working.')
})

app.post('/getactivity', (req, res) => {
    const activityToSearch =
        req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.activity
            ? req.body.result.parameters.activity
            : ''

    const reqUrl = encodeURI(
        `http://www.omdbapi.com/?t=${activityToSearch}&i=${process.env.I_KEY}&apikey=${process.env.API_KEY}`
    )
    http.get(
        reqUrl,
        responseFromAPI => {
            let completeResponse = ''
            responseFromAPI.on('data', chunk => {
                completeResponse += chunk
            })
            responseFromAPI.on('end', () => {
                const activity = JSON.parse(completeResponse)

                let dataToSend = activityToSearch
                dataToSend = `${activity.Title}}`

                return res.json({
                    fulfillmentText: dataToSend,
                    source: 'getactivity'
                })
            })
        },
        error => {
            return res.json({
                fulfillmentText: 'Could not get results at this time',
                source: 'getactivity'
            })
        }
    )
})

app.listen(port, () => {
    console.log(`🌏 Server is running at http://localhost:${port}`)
})