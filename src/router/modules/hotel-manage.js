import Layout from '@/layout'

const hotelRouter = {
  path: '/hotel',
  component: Layout,
  redirect: '/hotel/hotel-list',
  alwaysShow: true,
  id: 41,
  name: 'hotel',
  meta: {
    title: '酒店管理',
    icon: 'hotel'
  },
  children: [
    {
      path: 'hotel-list',
      component: () => import('@/views/hotel-manage/hotel-list'),
      name: 'hotel-list',
      id: 42,
      meta: { title: '酒店列表',}
    },
    {
      path: 'hotel-classify',
      component: () => import('@/views/hotel-manage/hotel-classify'),
      name: 'hotel-classify',
      id: 43,
      meta: { title: '酒店分类',}
    },
    {
      path: 'hotel-star',
      component: () => import('@/views/hotel-manage/hotel-star'),
      name: 'hotel-star',
      id: 44,
      meta: { title: '酒店星级', }
    },
    {
      path: 'hotel-service',
      component: () => import('@/views/hotel-manage/hotel-service'),
      name: 'hotel-service',
      id: 45,
      meta: { title: '酒店配置', }
    },
  ]
}

export default hotelRouter
