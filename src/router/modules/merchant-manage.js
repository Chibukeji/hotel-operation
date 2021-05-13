import Layout from '@/layout'

const merchantRouter = {
  path: '/merchant',
  component: Layout,
  redirect: '/merchant/merchant-list',
  alwaysShow: true,
  id: 38,
  name: 'merchant',
  meta: {
    title: '商家管理',
    icon: 'merchant'
  },
  children: [
    {
      path: 'merchant-list',
      component: () => import('@/views/merchant-manage/merchant-list'),
      name: 'merchant-list',
      id: 39,
      meta: { title: '商家列表', noCache: true }
    },
    {
      path: 'merchant-classify',
      component: () => import('@/views/merchant-manage/merchant-classify'),
      name: 'merchant-classify',
      id: 40,
      meta: { title: '商家分类', noCache: true }
    }
  ]
}

export default merchantRouter
