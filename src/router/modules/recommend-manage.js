import Layout from '@/layout'

const recommendRouter = {
  path: '/recommend-manage',
  component: Layout,
  redirect: '/recommend-manage/recommend-list',
  alwaysShow: true,
  id: 590,
  name: 'recommend-manage',
  meta: {
    title: '推荐位管理',
    icon: 'guide'
  },
  children: [
    {
      path: 'recommend-list',
      component: () => import('@/views/recommend-manage/recommend-list'),
      name: 'recommend-list',
      id: 591,
      meta: { title: '推荐位列表', noCache: true }
    }
  ]
}

export default recommendRouter