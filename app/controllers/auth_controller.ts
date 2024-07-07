import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * Handle user registration
   */
  async register({ request, response }: HttpContext) {
    const { username, email, password, fullName } = request.only([
      'username',
      'email',
      'password',
      'fullName',
    ])
    const [givenName, ...rest] = fullName.split(' ')
    const familyName = rest.join(' ')

    try {
      // Check if a user with the given email or username already exists
      const existingUser = await User.query()
        .where('email', email)
        .orWhere('username', username)
        .first()

      if (existingUser) {
        return response.status(409).json({
          status: 'error',
          success: false,
          message: 'Username or email already exists',
          data: null,
        })
      }

      // Create a new user
      const user = await User.create({
        username,
        email,
        password,
        givenName,
        familyName,
      })

      return response.status(201).json({
        status: 'success',
        success: true,
        message: 'User created successfully',
        data: user,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  /**
   * Handle user login
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Verify the user's credentials
      const user = await User.verifyCredentials(email, password)

      // Generate an access token for the user
      const token = await User.accessTokens.create(user, ['server:create', 'server:read'], {
        expiresIn: '30 day',
      })

      return response.status(200).json({
        status: 'success',
        success: true,
        message: 'Login successful',
        data: token,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        success: false,
        message: 'Invalid credentials',
        data: null,
      })
    }
  }
}
