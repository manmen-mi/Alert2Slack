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
        "fallback": (err ? "[Error] " : "[Success] ") + github.context.workflow + " in " + title,
        "color": err ? "#ff0000" : "#2eb886",
        "pretext": (err ? "Failed " : "Succeed ") + github.context.workflow,
        "title":"Detail...",
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