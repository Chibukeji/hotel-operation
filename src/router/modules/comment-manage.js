import Layout from '@/layout'

const commentRouter = {
  path: '/comment',
  component: Layout,
  redirect: '/comment/comment-list',
  alwaysShow: true,
  id: 30,
  name: 'comment',
  meta: {
    title: '评论管理',
    icon: 'edit'
  },
  children: [
    {
      path: 'comment-list',
      component: () => import('@/views/comment-manage/comment-list'),
      name: 'comment-list',
      id: 31,
      meta: { title: '评论列表',}
    },
    {
      path: 'comment-label',
      component: () => import('@/views/comment-manage/comment-label'),
      name: 'comment-label',
      id: 32,
      meta: { title: '评论标签',}
    }
  ]
}

export default commentRouter
