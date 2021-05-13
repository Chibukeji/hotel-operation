import Layout from '@/layout'

const intelligentFilterRouter = {
  path: '/intelligent-filter',
  component: Layout,
  redirect: '/intelligent-filter/intelligent-list',
  alwaysShow: true,
  id: 598,
  name: 'intelligent-filter',
  meta: {
    title: '智能筛选',
    icon: 'component'
  },
  children: [
    {
      path: 'intelligent-list',
      component: () => import('@/views/intelligent-filter/intelligent-list'),
      name: 'intelligent-list',
      id: 599,
      meta: { title: '筛选列表', noCache: true }
    },
  ]
}

export default intelligentFilterRouter
