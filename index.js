const core = require('@actions/core')
const github = require('@actions/github')
const axios = require('axios').default

const alert = async () => {
  try {
    const url = core.getInput('webhook')
    const title_link = core.getInput('title-link')
    await axios.post(url, {
      "attachments": [{
        "color": "#ff0000",
        "pretext": "Error in Github actions",
        "title":"Jump to repository",
        "title_link": title_link,
        "fields": [
          {
            "title": "Repository",
            "value": github.context.repo,
            "short": true
          },
          {
            "title": "Type",
            "value": "Error",
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