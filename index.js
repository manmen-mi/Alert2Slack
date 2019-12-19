const core = require('@actions/core')
const github = require('@actions/github')
const axios = require('axios').default

const alert = async () => {
  try {
    const url = core.getInput('webhook')
    const title = [github.context.repo.owner, github.context.repo.repo].join("/")
    await axios.post(url, {
      "attachments": [{
        "color": "#ff0000",
        "pretext": "Failed " + github.context.workflow,
        "title":"Actions report " + title,
        "title_link": "https://github.com/" + title + "/commit/" + github.context.sha + "/checks",
        "fields": [
          {
            "title": "Repository",
            "value": github.context.repo.repo,
            "short": true
          },
          {
            "title": "Event",
            "value": github.context.eventName,
            "short": true
          },
          {
            "title": "Actor",
            "value": github.context.actor,
            "short": true
          },
          {
            "title": "Action",
            "value": github.context.action,
            "short": true
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