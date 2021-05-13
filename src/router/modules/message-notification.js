
import Layout from '@/layout'

const messageNotificationRouter = {
  path: '/message-notification',
  component: Layout,
  redirect: '/message-notification/message-list',
  alwaysShow: true,
  id: 618,
  name: 'message-notification',
  meta: {
    title: '消息通知',
    icon: 'message'
  },
  children: [
    {
      path: 'message-list',
      component: () => import('@/views/message-notification/message-list'),
      name: 'message-list',
      id: 619,
      meta: { title: '消息通知', noCache: true }
    },
    {
      path: 'leave-message',
      component: () => import('@/views/message-notification/leave-message'),
      name: 'leave-message',
      id: 621,
      meta: { title: '意见反馈', noCache: true }
    },
  ]
}

export default messageNotificationRouter
