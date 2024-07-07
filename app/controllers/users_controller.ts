import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Fetch authenticated user's information (self)
   */
  self({ auth, response }: HttpContext) {
    return response.status(200).json({
      status: 'success',
      success: true,
      message: 'User details retrieved successfully',
      data: auth.user,
    })
  }
}
