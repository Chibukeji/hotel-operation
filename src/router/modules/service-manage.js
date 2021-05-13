import Layout from '@/layout'

const serviceRouter = {
  path: '/service-manage',
  component: Layout,
  redirect: '/service-manage/service-list',
  alwaysShow: true,
  id: 56,
  name: 'service-manage',
  meta: {
    title: '服务商管理',
    icon: 'service'
  },
  children: [
    {
      path: 'service-list',
      component: () => import('@/views/service-manage/service-list'),
      name: 'service-list',
      id: 57,
      meta: { title: '服务商列表', noCache: true }
    }
  ]
}

export default serviceRouter