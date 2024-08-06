import passport from 'passport'
import LocalStrategy from 'passport-local'
import userModel from '../persistencia/models/usersDTO.js'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github'
import jwt from 'passport-jwt'

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {
	passport.use(
		'register',
		new LocalStrategy(
			{ passReqToCallback: true, usernameField: 'email' },
			async (req, username, password, done) => {
				const { first_name, last_name, email, age, rol } = req.body

				try {
					const user = await userModel.findOne({ email: username })
					if (user) {
						console.log('Usuario existente')
						return done(null, false)
					}
					if (age <= 0 || Number.isNaN(age)) {
						console.log('Edad no válida')
						return done(null, false, {
							message: 'La edad debe ser un número positivo mayor que cero.',
						})
					}
					const newUser = {
						first_name,
						last_name,
						email,
						age,
						password: createHash(password),
						rol,
					}

					// Guardar el usuario
					const result = await userModel.create(newUser)
					return done(null, result)
				} catch (error) {
					return done(error)
				}
			},
		),
	)

	passport.use(
		'login',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
			},
			async (email, password, done) => {
				try {
					const user = await userModel.findOne({ email })
					if (!user) {
						return done(null, false, { message: 'Usuario no encontrado' })
					}
					const valid = isValidPassword(user, password)
					if (!valid) {
						return done(null, false, { message: 'Error de autenticación' })
					}
					return done(null, user)
				} catch (error) {
					return done(error)
				}
			},
		),
	)

	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: 'Iv23lio7O397p8vdBPXu',
				clientSecret: 'f4d92c1eba940055b887e56774f6ea5b473ea066',
				callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					console.log(profile)
					const user = await userModel.findOne({
						email: profile._json.email,
					})
					if (!user) {
						const newUser = {
							first_name: profile._json.name,
							last_name: 'apellido',
							age: 20,
							email: profile._json.email,
							password: '123',
							rol: 'premium',
						}

						const createdUser = await userModel.create(newUser)
						done(null, createdUser)
					} else {
						done(null, user)
					}
				} catch (error) {
					return done(error)
				}
			},
		),
	)

	passport.use(
		'jwt',
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
				secretOrKey: 'hola',
			},
			async (jwt_payload, done) => {
				try {
					const user = await userModel.findById(jwt_payload.id)
					if (!user) return done(null, false)

					return done(null, user)
				} catch (error) {
					return done(error)
				}
			},
		),
	)

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser((id, done) => {
		userModel
			.findById(id)
			.then((user) => {
				done(null, user)
			})
			.catch((err) => {
				done(err, null)
			})
	})
}

export default initializePassport
