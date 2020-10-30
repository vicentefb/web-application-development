const express = require('express')
// indexRouter variable will be equal to router variable
const router = express.Router()

router.get('/', (req, res) => {
	res.send('Hello')	
})

// We are able to export our router variable so other files are allowed
// to access the exported code
module.exports = router