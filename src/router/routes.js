
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SingleResult.vue') },
      { path: '/single-result', component: () => import('src/pages/SingleResult.vue') },
      { path: '/personal-perf', component: () => import('src/pages/PersonalPerf.vue') },
      { path: '/compare-result', component: () => import('src/pages/CompareResult.vue') },
      { path: '/feedback', component: () => import('src/pages/FeedbackPage.vue') },
      { path: '/batch-result', component: () => import('src/pages/BatchResult.vue') },
      { path: '/stats', component: () => import('src/pages/stats.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
