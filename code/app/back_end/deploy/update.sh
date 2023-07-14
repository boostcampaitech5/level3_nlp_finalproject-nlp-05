#!/usr/bin/env bash

set -e

PROJECT_BASE_PATH='/code/server'

cd $PROJECT_BASE_PATH

git pull origin feat/back_end_init

cd code/app/back_end

$PROJECT_BASE_PATH/code/app/back_end/env/bin/python manage.py migrate
$PROJECT_BASE_PATH/code/app/back_end/env/bin/python manage.py collectstatic --noinput

supervisorctl restart fine_api

echo "DONE! :)"