import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import merchantRouter from './modules/merchant-manage'
import hotelRouter from './modules/hotel-manage'
import wechatRouter from './modules/wechat'
import memberRouter from './modules/member-manage'
import orderRouter from './modules/order'
import commentRouter from './modules/comment-manage'
import hotCityRouter from './modules/city-manage'
import agentRouter from './modules/agent-manage'
import slideshowRouter from './modules/slideshow-manage'
import recommendRouter from './modules/recommend-manage'
import intelligentFilterRouter from './modules/intelligent-filter'
import articleRouter from './modules/article-manage'
import messageNotificationRouter from './modules/message-notification'
import commissionsDetailRouter from './modules/commissions-detail'
import questionsRouter from './modules/questions-answers'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/personal-data',
    alwaysShow: false, 
    name:'personal',
    children: [
      {
        path: '/change-password',
        name:'change-password',
        component: () => import('@/views/personal/change-password'),
        hidden: true,
        meta: { title: '修改密码',}
      },
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/workbench',
    component: Layout,
    redirect: '/home',
    id:613,
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'home',
        id:614,
        meta: { title: '我的工作台', icon: 'dashboard', affix: true }
      }
    ]
  },
  merchantRouter,//商家管理
  hotelRouter,//酒店管理
  memberRouter,//会员管理
  orderRouter,//订单
  wechatRouter,//微信公众号
  commentRouter,//评论管理
  hotCityRouter,//热门城市
  agentRouter,//代理管理
  slideshowRouter,//轮播图管理
  recommendRouter,//推荐位管理
  intelligentFilterRouter,//智能筛选
  articleRouter,//文章分类
  messageNotificationRouter,//消息通知
  commissionsDetailRouter,//佣金明细
  questionsRouter,//问答管理
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
