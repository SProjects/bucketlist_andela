#!/usr/bin/env bash

function build {
    cd bucketlist/client/
    npm run build
    cd -
}

function build_prod {
    cd bucketlist/client/
    npm run build_prod
    cd -
}

function install {
    pip install -r requirements.txt
    cd bucketlist/client/
    npm install
    bower install
    cd -
}

function serve {
    python manage.py runserver
}

function bt {
    nosetests --rednose
}

function bt_cov {
    nosetests --rednose --with-coverage --cover-inclusive --cover-package=bucketlist --cover-erase --cover-html
}

function ct {
    cd bucketlist/client/
    ng test
    cd -
}

function init {
    install
    build
}

function init_prod {
    install
    build_prod
}

# call arguments verbatim:
$@