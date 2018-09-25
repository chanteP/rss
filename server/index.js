const path = require('path');
const koa = require('koa');
const router = require('koa-router');
const static = require('koa-static');
const chalk = require('chalk');

const port = process.env.PORT || 9000;

const app = new koa;
const pages = new router;
pages.get('/pages', async => {});

app.use(static(
    path.join(__dirname,  '../dist')
));

app.use(pages.routes());

app.listen(port);
console.log(chalk.cyan(`server@port ${port}`));



