if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

// Declaring express server
const express = require('express')
// Getting the app variable from express by calling the express function
const app = express() 
// To be able to apply hashing to some of our passwords
const bcrypt = require('bcrypt')
// We use passport for authtentication
// passport-local is for using username and password only
const passport = require('passport')

// To store and persist our users across the pages we use express-session
// express-flash to display nice messsages about the login which is used inside passport
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')

const methodOverride = require('method-override')

// We are calling the initialize function insde passport-config file
initializePassport(
	passport, 
	email => users.find(user => user.email === email),
	id => users.find(user => user.id === id)
)

// Users array
const users = []

// Telling our server we want to use ejs
app.set('view-engine', 'ejs')

// We are telling our application is take the forms from login email and password
// and we want to access them inside of our request method inside of our post method
app.use(express.urlencoded({extended: false}))

// Flash
app.use(flash())

// session takes a bunch of parameters
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUnitialized: false
}))

// Initialize function inside passport
app.use(passport.initialize())
// So our variables are persistent acrros the sesssions which works with the app.use(session above)
app.use(passport.session())

app.use(methodOverride('_method'))

// Set up a route that gets a function with a request and response variable
// checkAuthenticated function will be called first to see if the user is already authenticated
// This helps us to redirect to login page if we are not logged in
app.get('/', checkAuthenticated, (req, res) => {
	res.render('index.ejs', {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
	res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/', 
	failureRedirect: '/login', 
	failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
	res.render('register.ejs')
})

// To be ably to use try catch we need to make the function async
app.post('/register', checkNotAuthenticated, async (req, res) =>{
	// This corresponds to the variables of name, email or password inside the form
	try{
		// Making a hash password. 
		// The value 10 represents how many hashes we want to apply
		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		users.push({
			id: Date.now().toString(), 
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		})
		res.redirect('/login')
	} catch {
		res.redirect('/register')
	}
	console.log(users)
})

// To be able to logout
// delete is not supported by form but it is by post
app.delete('/logout', (req, res) => {
	// logOut function is implemented in passport
	req.logOut()
	res.redirect('/login')
})

function checkAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		// next() is a reference to the next function to execute
		// It holds a reference to the next action to perform and is called
		// once checkAuthenticated is done unless this is false
		return next()
	}

	res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return res.redirect('/')
	}
	next()
}


// Our application will be running on port 3000
app.listen(3000)