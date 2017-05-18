BUCKETLIST
==========

Technology Stack
----------------

**Backend**
- Python 2.7
- Postgres 9.4
- Flask
- Flash Restful

**Frontend**
- Angular 2

**Pre-requisites**
* Install [Python v2.7.*](https://www.python.org/downloads/)
* Install [virtualenv and/or virtualenvwrapper](http://docs.python-guide.org/en/latest/dev/virtualenvs/)

Setup
-----
1. Create a virtual environment and activate it. 
2. Clone the project from `https://github.com/SProjects/bucketlist_andela.git`
3. `cd` into the project root
4. Run `pip install requirements.txt` to install all project dependencies to the virtual environment.
5. Create database. Run `createdb bucketlist_dev` in the terminal
6. Migrate the database using `python manage.py db upgrade`
