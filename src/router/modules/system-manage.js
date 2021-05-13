import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/system-configuration',
  alwaysShow: true,
  id: 5,
  name: 'system',
  meta: {
    title: '系统管理',
    icon: 'system'
  },
  children: [
    {
      path: 'system-configuration',
      component: () => import('@/views/system-manage/system-configuration'),
      name: 'system-configuration',
      id: 11,
      meta: { title: '系统配置', noCache: true }
    },
    {
      path: 'user-manage',
      component: () => import('@/views/system-manage/user-manage'),
      name: 'user-manage',
      id: 11,
      meta: { title: '用户管理', noCache: true }
    },
    {
      path: 'role-manage',
      component: () => import('@/views/system-manage/role-manage'),
      name: 'role-manage',
      id: 11,
      meta: { title: '角色管理', noCache: true }
    },
    {
      path: 'system-menu',
      component: () => import('@/views/system-manage/system-menu'),
      name: 'system-menu',
      id: 11,
      meta: { title: '系统菜单', noCache: true }
    },
    {
      path: 'operation-log',
      component: () => import('@/views/system-manage/operation-log'),
      name: 'operation-log',
      id: 11,
      meta: { title: '操作日志', noCache: true }
    }
  ]
}

export default systemRouter
