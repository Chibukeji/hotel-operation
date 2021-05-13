import Layout from '@/layout'

const questionsRouter = {
  path: '/questions-answers',
  component: Layout,
  redirect: '/questions-answers/questions-list',
  alwaysShow: true,
  id: 671,
  name: 'questions',
  meta: {
    title: '问答管理',
    icon: 'questions'
  },
  children: [
    {
      path: 'questions-list',
      component: () => import('@/views/questions-answers/questions-list'),
      name: 'questions-list',
      id: 672,
      meta: { title: '问答列表',}
    }
  ]
}

export default questionsRouter
