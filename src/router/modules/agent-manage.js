import Layout from '@/layout'

const agentRouter = {
  path: '/agent-manage',
  component: Layout,
  redirect: '/agent-manage/agent-list',
  alwaysShow: true,
  id: 576,
  name: 'agent-manage',
  meta: {
    title: '代理管理',
    icon: 'peoples'
  },
  children: [
    {
      path: 'agent-list',
      component: () => import('@/views/agent-manage/agent-list'),
      name: 'agent-list',
      id: 577,
      meta: { title: '代理列表', noCache: true }
    }
  ]
}

export default agentRouter