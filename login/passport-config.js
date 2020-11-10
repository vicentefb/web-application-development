const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById){
	// authenticateUser function will take some parameters
	// email which is the usernameField 
	// password
	// done which will be used to knwo when we had authenticate a user
	const authenticateUser = async (email, password, done) =>{
		// Get user by email
		const user = getUserByEmail(email)
		if(user == null){
			return done(null, false, {message:'No user with that email'})
		}

		try{
			if(await bcrypt.compare(password, user.password)){
				// If password is correct we return the user we want to authenticate with
				return done(null, user)
			} else {
				return done(null, false, {message: 'Password incorrect'})
			}

		} catch (e){
			// return error with application
			return done(e)
		}
	}
	
	passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))

	// We serialize our user to store inside the session
	passport.serializeUser((user, done) => done(null, user.id))
	passport.deserializeUser((id, done) =>{
		return done(null, getUserById(id))
	})
}

module.exports = initialize