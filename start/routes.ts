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
const ConversationsController = () => import('#controllers/conversations_controller')

router
  .group(() => {
    router.get('', [AgentsController, 'index'])
    router.post('', [AgentsController, 'create'])
    router.get(':id', [AgentsController, 'getAgent']).where('id', router.matchers.number())
    router.put(':id', [AgentsController, 'update']).where('id', router.matchers.number())
    router.delete(':id', [AgentsController, 'delete']).where('id', router.matchers.number())
  })
  .prefix('/agents')

router
  .group(() => {
    router.post('', [ConversationsController, 'create'])
    router.post(':id/messages', [ConversationsController, 'sendMessage'])
    router.get(':id', [ConversationsController, 'getConversation'])
  })
  .prefix('/conversations')
