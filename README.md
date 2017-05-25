# BUCKETLIST
[ ![Codeship Status for SProjects/bucketlist_andela](https://app.codeship.com/projects/653f2380-22cd-0135-e26b-02c71a3ce6a4/status?branch=master)](https://app.codeship.com/projects/221826) [![Code Climate](https://codeclimate.com/github/SProjects/bucketlist_andela/badges/gpa.svg)](https://codeclimate.com/github/SProjects/bucketlist_andela) [![Test Coverage](https://codeclimate.com/github/SProjects/bucketlist_andela/badges/coverage.svg)](https://codeclimate.com/github/SProjects/bucketlist_andela/coverage)

## Introduction
Bucketlist is an API powered application that helps its users to create bucketlists and add todo items to them.


## Technology Stack

**Backend**
- Python 2.7
- Postgres 9.4
- Flask 0.12.2
- Flash Restful 0.3.5

**Frontend**
- Angular 2

**Pre-requisites**
* Install [Python v2.7.*](https://www.python.org/downloads/)
* Install [virtualenv and/or virtualenvwrapper](http://docs.python-guide.org/en/latest/dev/virtualenvs/)

## Setup

1. Create a virtual environment and activate it. 
2. Clone the project from `https://github.com/SProjects/bucketlist_andela.git`
3. `cd` into the project root
4. Run `pip install requirements.txt` to install all project dependencies to the virtual environment.
5. Create database. Run `createdb bucketlist_dev` in the terminal
6. Migrate the database using `python manage.py db upgrade`
7. Start the application with; `python manage.py runserver`

## Usage

#### Authorization

- Using the authentication endpoint get a token to send as a username 
in basic authentication parameters.
- OR Use your username and password as parameters for basic 
authentication


#### Registration Endpoint

Url: `http://<base_url>/api/v1/auth/register`
Action: `POST` 
Data  
```javascript 
{
    'first_name': 'FirstName', 
    'last_name': 'LastName', 
    'email': 'email@address.com', 
    'password': 'good_password', 
    'password_confirm': 'good_password'
}
``` 
Response 
```javascript
{'message': 'You registered successfully.'}
``` 
Authorization: False 

#### Authentication Endpoint

Url: `http://<base_url>/api/v1/auth/login`  
Action: `POST`  
Data    
```javascript
    {
        'email': 'email@address.com', 
        'password': 'good_password'
    }
``` 
Response   
```javascript
    {'token': 'alphanumeric_string'}
``` 
Authorization: False 

#### User Endpoints

##### Get all user

Url: `http://<base_url>/api/v1/users`  
Action: `GET`  
Authorization: True  

##### Get a user

Url: `http://<base_url>/api/v1/users/<user_id>`  
Action: `GET`  
Authorization: True  

##### Edit a user

Url: `http://<base_url>/api/v1/users/<user_id>`  
Action: `PUT`  
Data  
```javascript
    {
        'first_name': 'updated_first_name',
        'last_name': 'updated_last_name',
        'email': 'updated_email'
        'old_password': 'current_password',
        'new_password': 'new_password',
        'new_password_confirm': 'new_password'
    }
``` 
Response:  
*Updated user object* 
Authorization: True 

##### Delete a user

Url: `http://<base_url>/api/v1/users/<user_id>`  
Action: `DELETE`  
Authorization: True  

#### Bucketlist Endpoints

##### Add new bucketlist

Url: `http://<base_url>/api/v1/bucketlists`  
Action: `POST`  
Data  
```javascript
    {'name': 'Bucketlist Name'}
``` 
Response  
```javascript
    {'message': 'Bucketlist created successfully.'}
``` 
Authorization: True 

##### Get all bucketlists

Url: `http://<base_url>/api/v1/bucketlists`  
Action: `GET`  
Authorization: True  

##### Get a bucketlist 

Url: `http://<base_url>/api/v1/bucketlists/<bucketlist_id>`  
Action: `GET`  
Authorization: True  

##### Edit a bucketlist

Url: `http://<base_url>/api/v1/bucketlists/<bucketlist_id>`  
Action: `PUT`  
Data  
```javascript
    {'name': 'Bucketlist Name'}
``` 
Response  
*Updated bucketlist object*   
Authorization: True 

##### Delete a bucketlist

Url: `http://<base_url>/api/v1/bucketlists/<bucketlist_id>`  
Action: `DELETE`  
Authorization: True  
##### Search bucketlists by name

Url: `http://<base_url>/api/v1/bucketlists?q=<search_term>`   
Action: `GET`  
Authorization: True  

##### Paginate bucketlist

Url: `http://<base_url>/api/v1/bucketlists?limit=<page_size>`  
Action: `GET`  
Response:  
```javascript
{
  "data": [
    {
      "created_by": 1,
      "date_created": "Tue, 23 May 2017 10:59:06 -0000",
      "date_modified": "Tue, 23 May 2017 12:26:50 -0000",
      "id": 1,
      "items": [
        {
          "date_created": "Tue, 23 May 2017 14:25:13 -0000",
          "date_modified": "Tue, 23 May 2017 14:25:13 -0000",
          "done": false,
          "id": 1,
          "name": "To do item"
        }
      ],
      "name": "Bucketlist name"
    }
  ],
  "next": "/api/v1/bucketlists?limit=1&page=1",
  "num_results": 2,
  "page": 1,
  "total_pages": 2
}
```
Authorization: True  

#### Bucketlist Item Endpoints

##### Add new bucketlist item

Url: `http://<base_url>/api/v1/bucketlists/<bucketlist_id>/items`   
Action: `POST`  
Data  
```javascript
{'name': 'Item Name'}
``` 
Response:  
```javascript
{'message': 'Item successfully added to Bucketlist ID#<bucketlist_id>'}
``` 
Authorization: True 

##### Get all bucketlist items

Url: `http://<base_url>/api/v1/bucketlists/<bucketlist_id>/items`  
Action: `GET`  
Authorization: True 

##### Get a bucketlist item

Url: `http://<base_url>/api/v1/bucketlists/<bucketlist_id>/items/<item_id>`  
Action: `GET`  
Authorization: True 

##### Edit a bucketlist item

Url: `http://<base_url>/api/v1/bucketlists/<bucketlist_id>/items/<item_id>`  
Action: `PUT`  
Data (*done can be True for completed or False for incomplete*)  
```javascript
{'name': 'Bucketlist Name', 'done': True}
``` 
Response:  
*Updated item object*   
Authorization: True 

##### Delete a bucketlist item

Url: `http://<base_url>/api/v1/bucketlists/<bucketlist_id>/items/<item_id>`  
Action: `DELETE`  
Authorization: True  

## Automated Tests

##### Run tests
`nosetests --rednose`

##### Run tests with coverage
`nosetests --rednose --with-coverage --cover-inclusive --cover-package=bucketlist --cover-erase --cover-html`