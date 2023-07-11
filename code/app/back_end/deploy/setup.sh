#!/usr/bin/env bash

set -e

apt-get update
apt-get install -y python3-dev python3-venv sqlite3 supervisor nginx git
apt-get install build-essential python

PROJECT_GIT_URL='https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05.git'
PROJECT_BASE_PATH='/code/server'

mkdir -p $PROJECT_BASE_PATH
git clone $PROJECT_GIT_URL $PROJECT_BASE_PATH

mkdir -p $PROJECT_BASE_PATH/code/app/back_end/env
python3 -m venv $PROJECT_BASE_PATH/code/app/back_end/env

cd server
git remote set-url origin https://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@github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05.git

$PROJECT_BASE_PATH/code/app/back_end/env/bin/pip install -r /code/requirements.txt uwsgi==2.0.21

$PROJECT_BASE_PATH/code/app/back_end/env/bin/python $PROJECT_BASE_PATH/code/app/back_end/manage.py migrate
$PROJECT_BASE_PATH/code/app/back_end/env/bin/python $PROJECT_BASE_PATH/code/app/back_end/manage.py collectstatic --noinput

cp $PROJECT_BASE_PATH/code/app/back_end/deploy/supervisor_fine_api.conf /etc/supervisor/conf.d/fine_api.conf
supervisorctl reread
supervisorctl update
supervisorctl restart fine_api

cp $PROJECT_BASE_PATH/code/app/back_end/deploy/nginx_fine_api.conf /etc/nginx/sites-available/fine_api.conf
rm /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/fine_api.conf /etc/nginx/sites-enabled/fine_api.conf
systemctl restart nginx.service

echo "DONE! :)"