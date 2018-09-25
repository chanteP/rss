#!/usr/bin/env bash
set -e

pm2 kill
pm2 startOrGracefulReload ./server/pm2.json

pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
# pm2 set pm2-logrotate:interval 30
pm2 set pm2-logrotate:rotateInterval "59 59 23 * * *"
# pm2 set pm2-logrotate:retain "all"
# pm2 set pm2-logrotate:dateFormat "YYYY-MM-DD"
exec pm2 log

