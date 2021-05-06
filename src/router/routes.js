
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SingleResult.vue') },
      { path: '/single-result', component: () => import('src/pages/SingleResult.vue') },
      { path: '/multi-result', component: () => import('src/pages/MultiResult.vue') },
      { path: '/feedback', component: () => import('src/pages/FeedbackPage.vue') },
      { path: '/sem-result', component: () => import('pages/SemResult.vue') },
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
