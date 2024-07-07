/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

router.get('/health', async ({ response }: HttpContext) => {
  return response.status(200).json({
    status: 'success',
    success: true,
    message: 'Application is up and running',
    data: null,
  })
})

router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.post('/register', [AuthController, 'register'])
            router.post('/login', [AuthController, 'login'])
          })
          .prefix('/auth')
      })
      .prefix('/v1')
  })
  .prefix('/api')

export default router
