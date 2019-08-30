const path = require('path');
const koa = require('koa');
const static = require('koa-static');
const chalk = require('chalk');
const fetch = require('node-fetch');
const {exec} = require('child_process');

const port = process.env.PORT || 9000;
const targetPoint = 'https://rsshub.app/';

const app = new koa;

app.use(async(ctx, next) => {
    if(!ctx.path.startsWith('/api/')){
        return await next();
    }
    let rs = await fetch(targetPoint + ctx.path.replace('/api/', ''));
    ctx.body = await rs.text();
});

app.use(static(
    path.join(__dirname,  '../dist')
));

app.listen(port);
console.log(chalk.cyan(`server@port ${port}`));
exec(`open http://localhost:${port}`);



