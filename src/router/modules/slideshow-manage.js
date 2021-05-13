import Layout from '@/layout'

const slideshowRouter = {
  path: '/slideshow-manage',
  component: Layout,
  redirect: '/slideshow-manage/slideshow-list',
  alwaysShow: true,
  id: 582,
  name: 'slideshow-manage',
  meta: {
    title: '轮播图管理',
    icon: 'image'
  },
  children: [
    {
      path: 'slideshow-list',
      component: () => import('@/views/slideshow-manage/slideshow-list'),
      name: 'slideshow-list',
      id: 583,
      meta: { title: '轮播图列表', noCache: true }
    }
  ]
}

export default slideshowRouter