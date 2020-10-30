// We are going to use MVC to hold our views folder

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

// route folder to hold the routes to differnt paths
// indexRouter variable is going to be set to the router variable in index.js
const indexRouter = require('./routes/index')

app.set('view-engine', 'ejs')
// Every view file will be placed inside this view folder
app.set('views', __dirname + '/views')
// Every single layout file will placed inside this layout
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
// Where our public files are going to be: css, style sheets, javascript files, images
app.use(express.static('public'))

// Tell the app that we want to use 
app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)