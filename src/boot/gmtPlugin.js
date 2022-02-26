import gtm from 'src/components/gtm';

export default ({ router }) => {

    router.afterEach((to, from) => {
        gtm.logPage(to.path);
    })
}