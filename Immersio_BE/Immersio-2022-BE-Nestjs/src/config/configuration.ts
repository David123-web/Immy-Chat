export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    init: process.env.INIT_PROJECT,
});
