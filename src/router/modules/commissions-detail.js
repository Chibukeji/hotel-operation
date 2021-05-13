import Layout from '@/layout'

const commissionsDetailRouter = {
  path: '/commissions-detail',
  component: Layout,
  redirect: '/commissions-detail/city-list',
  alwaysShow: true,
  id: 627,
  name: 'commissions-detail',
  meta: {
    title: '佣金明细',
    icon: 'money'
  },
  children: [
    {
      path: 'commissions-list',
      component: () => import('@/views/commissions-detail/commissions-list'),
      name: 'commissions-list',
      id: 628,
      meta: { title: '佣金列表', noCache: true }
    },
    {
      path: 'withdraw-list',
      component: () => import('@/views/commissions-detail/withdraw-list'),
      name: 'withdraw-list',
      id: 676,
      meta: { title: '会员提现单', noCache: true }
    }
  ]
}

export default commissionsDetailRouter