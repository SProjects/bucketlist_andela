#!/usr/bin/env bash
set -e

python manage.py db upgrade
python manage.py runserver -h 0.0.0.0 -p 5000
