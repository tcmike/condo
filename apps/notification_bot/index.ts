require('dotenv').config()

import { createHmac } from 'crypto'
import express from 'express'
import cors from 'cors'

import { BotController } from './botController'
import { getPullRequestMessage } from './utils'

const app = express()

import JiraApi from 'jira-client'
const jiraApi = new JiraApi({
    protocol: 'https',
    host: 'jira.atlassian.net',
    username: 'username',
    password: 'password',
    apiVersion: '2',
    strictSSL: true,
})

const bot = new BotController(jiraApi)
bot.init()

app.use(express.json())
app.use(cors())

function verify_signature (payload_body) {
    const secretToken = process.env.NOTIFICATION_BOT_CONFIG && JSON.parse(process.env.NOTIFICATION_BOT_CONFIG)?.github_secure_token
    const expected = createHmac('sha256', payload_body).digest('hex')
    console.log(expected, secretToken)
    // TODO: add verification by Token
}

app.post('/pullRequestUpdate/', (req, res) => {
    if (req.body?.action !== 'opened') {
        return
    }

    const pullRequest = req.body?.pull_request

    if (!pullRequest) {
        return
    }

    // const signature = req.headers['http_x_hub_signature_256']
    // verify_signature(signature)

    const message = getPullRequestMessage(pullRequest._links.html.href, pullRequest.user.login, bot.getUsers())
    bot.sendMessage(message)
    res.send('OK')
})

// get from env
app.listen(5000, () => {
    console.log('listening on 5000')
})
