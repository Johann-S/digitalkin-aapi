/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const AgentsController = () => import('#controllers/agents_controller')

router
  .group(() => {
    router.get('', [AgentsController, 'index'])
    router.get(':id', [AgentsController, 'getAgent']).where('id', router.matchers.number())
    router.post('', [AgentsController, 'create'])
    router.put(':id', [AgentsController, 'update']).where('id', router.matchers.number())
  })
  .prefix('/agents')
