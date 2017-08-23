#!/usr/bin/env bash
set -e

cd bucketlist/client/
npm install
npm run postinstall
npm run build
cd -

python manage.py db upgrade
python manage.py runserver -h 0.0.0.0 -p 5000