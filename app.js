const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

require('./routes/authentication')(app)
require('./routes/user')(app)
require('./routes/audit-events')(app)

module.exports = app
