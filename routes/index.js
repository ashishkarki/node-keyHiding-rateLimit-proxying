const url = require('url')
const express = require('express')
const router = express.Router()
const needle = require('needle')
const apicache = require('apicache')

// required environment variables
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

// Initialize the cache
const cache = apicache.middleware

router.get('/', cache('2 minutes'), async (req, res) => {
  try {
    const queryFromReqUrl = req.query
    //url.parse(req.url, true).query

    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...queryFromReqUrl,
    })

    const reqUrl = `${API_BASE_URL}?${params}`
    const apiResult = await needle('get', reqUrl)
    const data = await apiResult.body

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Request: ${API_BASE_URL}?${params}`)
    }

    res.status(200).json({
      message: data,
      success: true,
    })
  } catch (error) {
    res.status(500).json({ message: error, success: false })
  }
})

module.exports = router
