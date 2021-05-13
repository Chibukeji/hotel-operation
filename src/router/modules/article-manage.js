import Layout from '@/layout'

const articleRouter = {
  path: '/article-manage',
  component: Layout,
  redirect: '/article-manage/article-list',
  alwaysShow: true,
  id: 137,
  name: 'article-manage',
  meta: {
    title: '文章管理',
    icon: 'skill'
  },
  children: [
    {
      path: 'article-list',
      component: () => import('@/views/article-manage/article-list'),
      name: 'article-list',
      id: 139,
      meta: { title: '文章列表', noCache: true }
    },
    {
        path: 'article-classify',
        component: () => import('@/views/article-manage/article-classify'),
        name: 'article-classify',
        id: 138,
        meta: { title: '文章分类', noCache: true }
      }
  ]
}

export default articleRouter