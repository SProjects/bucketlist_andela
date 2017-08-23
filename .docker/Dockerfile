FROM ubuntu

MAINTAINER Sebuuma Daniel <sedzsoft@gmail.com>

RUN apt-get update -y
RUN apt-get install -y python-dev python-pip libpq-dev curl

RUN mkdir app
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt

EXPOSE 5000

ENTRYPOINT ["./.docker/init.sh"]