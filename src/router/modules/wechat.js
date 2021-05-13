import Layout from '@/layout'

const wechatRouter = {
  path: '/wechat',
  component: Layout,
  redirect: '/wechat/wechat-menu',
  alwaysShow: true,
  id: 50,
  name: 'wechat',
  meta: {
    title: '微信管理',
    icon: 'wechat'
  },
  children: [
    {
      path: 'wechat-configuration',
      component: () => import('@/views/wechat/wechat-configuration'),
      name: 'merchant-configuration',
      id: 51,
      meta: { title: '公众号配置', noCache: true }
    },
    {
      path: 'wechat-menu',
      component: () => import('@/views/wechat/wechat-menu'),
      name: 'merchant-list',
      id: 52,
      meta: { title: '微信菜单', noCache: true }
    },
    {
      path: 'referral-code',
      component: () => import('@/views/wechat/referral-code'),
      name: 'referral-code',
      id: 629,
      meta: { title: '推荐码配置', noCache: true }
    },
    {
      path: 'mass-message',
      component: () => import('@/views/wechat/mass-message'),
      name: 'mass-message',
      id: 632,
      meta: { title: '群发消息', noCache: true }
    }
  ]
}

export default wechatRouter
