import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/order-list',
  alwaysShow: true,
  id: 48,
  name: 'order',
  meta: {
    title: '订单管理',
    icon: 'list'
  },
  children: [
    {
      path: 'order-list',
      component: () => import('@/views/order/order-list'),
      name: 'order-list',
      id: 49,
      meta: { title: '订单列表', noCache: true }
    },
    {
      path: 'overdue-order',
      component: () => import('@/views/order/overdue-order'),
      name: 'overdue-order',
      id: 609,
      meta: { title: '分时过期订单', noCache: true }
    },
    {
      path: 'member-card-order',
      component: () => import('@/views/order/member-card-order'),
      name: 'member-card-order',
      id: 617,
      meta: { title: '会员卡订单', noCache: true }
    },
    {
      path: 'refund-order',
      component: () => import('@/views/order/refund-order'),
      name: 'refund-order',
      id: 660,
      meta: { title: '退款订单'}
    },
  ]
}

export default orderRouter
