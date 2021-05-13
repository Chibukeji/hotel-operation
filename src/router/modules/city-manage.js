import Layout from '@/layout'

const hotCityRouter = {
  path: '/city-manage',
  component: Layout,
  redirect: '/city-manage/city-list',
  alwaysShow: true,
  id: 33,
  name: 'city-manage',
  meta: {
    title: '城市管理',
    icon: 'city'
  },
  children: [
    {
      path: 'city-list',
      component: () => import('@/views/city-manage/city-list'),
      name: 'city-list',
      id: 34,
      meta: { title: '城市列表', noCache: true }
    },
    {
      path: 'hot-city',
      component: () => import('@/views/city-manage/hot-city'),
      name: 'hot-city',
      id: 35,
      meta: { title: '热门城市', noCache: true }
    }
  ]
}

export default hotCityRouter