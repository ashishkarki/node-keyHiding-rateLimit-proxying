const express = require('express')
const path = require('path')
const cors = require('cors')
const router = require('./routes')
const rateLimit = require('express-rate-limit')

// configure env variables
require('dotenv').config()

const PORT = process.env.PORT || 5001

const app = express()

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes in milliseconds
  max: 50, // max 5 requests in 10 minutes window
})

// middlewares
app.use(cors())
app.use(limiter)
app.set('trust proxy', 1)

// static paths
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/api', router)

// listen
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
