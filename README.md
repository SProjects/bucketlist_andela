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
7. Start the application with; `python manage.py runserver`

Usage
-----
**Authorization**

- Using the authentication endpoint get a token to send as a username 
in basic authentication parameters.
- OR Use your username and password as parameters for basic 
authentication


**Registration Endpoint**
> Url: ``http://<base_url>/auth/register`` 
> Action: ``POST`` 
> Data  
> `` 
> {'first_name': 'FirstName', 'last_name': 'LastName', 
> 'email': 'email@address.com', 'password': 'good_password', 
> 'password_confirm: 'good_password'}
> `` 
> Response 
> ``{'message': 'You registered successfully.'}`` 
> Authorization: False 

**Authentication Endpoint**
> Url: ``http://<base_url>/auth/login`` 
> Action: ``POST`` 
> Data  
> ``
> {'email': 'email@address.com', 'password': 'good_password'}
> `` 
> Response 
> ``{'token': 'alphanumeric_value'}`` 
> Authorization: False 

**User Endpoints**

*Get all user*
> Url: ``http://<base_url>/users`` 
> Action: ``GET`` 
> Authorization: True 

*Get a user*
> Url: ``http://<base_url>/users/<user_id>`` 
> Action: ``GET`` 
> Authorization: True 

*Delete a user*
> Url: ``http://<base_url>/users/<user_id>`` 
> Action: ``DELETE`` 
> Authorization: True 

**Bucketlist Endpoints**

*Add new bucketlist*
> Url: ``http://<base_url>/bucketlists`` 
> Action: ``POST`` 
> Data  
> ``
> {'name': 'Bucketlist Name'}
> `` 
> Response 
> ``{'message': 'Bucketlist created successfully.'}`` 
> Authorization: True 

*Get all bucketlists*
> Url: ``http://<base_url>/bucketlists`` 
> Action: ``GET`` 
> Authorization: True 

*Get a bucketlist* 
> Url: ``http://<base_url>/bucketlists/<bucketlist_id>`` 
> Action: ``GET`` 
> Authorization: True 

*Edit a bucketlist*
> Url: ``http://<base_url>/bucketlists/<bucketlist_id>`` 
> Action: ``PUT`` 
> Data  
> ``
> {'name': 'Bucketlist Name'}
> `` 
> Response 
> *Updated bucketlist object* 
> Authorization: True 

*Delete a bucketlist*
> Url: ``http://<base_url>/bucketlists/<bucketlist_id>`` 
> Action: ``DELETE`` 
> Authorization: True 

**Bucketlist Item Endpoints**

*Add new bucketlist*
> Url: ``http://<base_url>/bucketlists/<bucketlist_id>/items`` 
> Action: ``POST`` 
> Data  
> ``
> {'name': 'Item Name'}
> `` 
> Response 
> ``{'message': 'Item successfully added to Bucketlist ID#<bucketlist_id>'}`` 
> Authorization: True 

*Get all bucketlists*
> Url: ``http://<base_url>/bucketlists/<bucketlist_id>/items`` 
> Action: ``GET`` 
> Authorization: True 

*Get a bucketlist*
> Url: ``http://<base_url>/bucketlists/<bucketlist_id>/items/<item_id>`` 
> Action: ``GET`` 
> Authorization: True 

*Edit a bucketlist*
> Url: ``http://<base_url>/bucketlists/<bucketlist_id>/items/<item_id>`` 
> Action: ``PUT`` 
> Data (*done can be True for completed or False for incomplete*) 
> ``
> {'name': 'Bucketlist Name', 'done': True}
> `` 
> Response 
> *Updated item object* 
> Authorization: True 

*Delete a bucketlist*
> Url: ``http://<base_url>/bucketlists/<bucketlist_id>/items/<item_id>`` 
> Action: ``DELETE`` 
> Authorization: True 

*Search bucketlists by name*
> Url: ``http://<base_url>/bucketlists?q=<search_term>`` 
> Action: ``GET`` 
> Authorization: True 