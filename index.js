const core = require('@actions/core')
const github = require('@actions/github')
const axios = require('axios').default

const alert = async () => {
  try {
    const err = core.getInput('is-err') === true
    const url = core.getInput('webhook')
    core.debug(`is-err:${err}, url:${url}`)

    const title = [github.context.repo.owner, github.context.repo.repo].join("/")
    await axios.post(url, {
      "attachments": [{
        "color": err ? "danger" : "good",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": (err ? "Failed " : "Succeed ") + github.context.workflow
            },
            "accessory": {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Detail"
              },
              "url": "https://github.com/" + title + "/commit/" + github.context.sha + "/checks"
            }
          },
          {
            "type": "section",
            "fields": [
              {
                "type": "mrkdwn",
                "text": "*Repository:*\n" + github.context.repo.repo
              },
              {
                "type": "mrkdwn",
                "text": "*Event:*\n" + github.context.eventName
              }
            ]
          }
        ]
      }]
    }, {'Content-type':'application/json'})
    console.log('message posted')
  } catch (error) {
    core.setFailed(error.message)
  }
}

alert()