const path = require('path');
const koa = require('koa');
const router = require('koa-router');
const static = require('koa-static');
const koaBody = require('koa-body');
const chalk = require('chalk');
const moment = require('moment');
const queryString = require('query-string');

const port = process.env.PORT || 9000;

const app = new koa;
const pages = new router;

app.use(async(ctx, next) => {
    debugger
    let pvData = {
        time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        url: ctx.path,
        query: ctx.request.querystring,
    };
    let t1 = Date.now();
    try{
        await next();
    }catch(e){
        console.error(`[pv error]`, JSON.stringify(pvData), e);
    }
    let t2 = Date.now();

    pvData.cost = t2 - t1;
    console.log(`[pv view]`, JSON.stringify(pvData));
});

app.use(static(
    path.join(__dirname,  '../dist')
));

app.use(static(
    path.join(__dirname,  '../dist')
));

app.use(pages.routes());

app.listen(port);
console.log(chalk.cyan(`server@port ${port}`));



