# szglab5-backend

Backend repository for laboradmin backend

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Config](#config)
- [Commands](#commands)
- [Endpoints](#endpoints)
- [Useful links](#useful-links)

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (6.x)
* [PostgreSQL](https://www.postgresql.org/)

## Installation

```
git clone <repository-url> this repository
cd szglab5-frontend
npm install
npm install nodemon -g
```

## Config

## Commands
#### CLI (npm run start cli:"ENV" "command")
##### seed [filepath]
* filepath: the json file path that contains the seed data, relative to /db/seedData (__default__: 'dev.seed.json')

```
npm run cli:dev seed test1.seed.json
```

#### START (npm run start:"ENV")
Starts the API server
```
npm run start:dev
```

## Endpoints
The endpoints format fit JSON API specification.

Model names in plural (-> modelNamePlural):
* tests (Test model)
* languages (Language model)
* questions (Question model)

### Fetching Resources
#### List (GET /:modelNamePlural)
Request: GET /questions HTTP/1.1
Response:
```
{
  "data": [
    {
      "type": "questions",
      "id": 4,
      "attributes": {
        "id": 4,
        "text": "tuturu 2",
        "createdAt": "2017-03-15T17:07:30.284Z",
        "updatedAt": "2017-03-15T17:07:30.284Z",
        "testId": 2
      },
      "relationships": {
        "test": {
          "data": {
            "id": 2,
            "type": "tests"
          }
        }
      }
    },
    {
      "type": "questions",
      "id": 1,
      "attributes": {
        "id": 1,
        "text": "Kérdés 1",
        "createdAt": "2017-03-15T17:07:30.244Z",
        "updatedAt": "2017-03-15T17:07:30.244Z",
        "testId": null
      },
      "relationships": {
        "test": null
      }
    },
    {
      "type": "questions",
      "id": 2,
      "attributes": {
        "id": 2,
        "text": "Kérdés 2",
        "createdAt": "2017-03-15T17:07:30.261Z",
        "updatedAt": "2017-03-15T17:07:30.261Z",
        "testId": null
      },
      "relationships": {
        "test": null
      }
    }
  ]
}
```
#### Get (GET /:modelNamePlural/:id)
Request: GET /questions/2 HTTP/1.1
Response:
```
{
  "data": {
    "type": "questions",
    "id": 2,
    "attributes": {
      "id": 2,
      "text": "Kérdés 2",
      "createdAt": "2017-03-15T17:07:30.261Z",
      "updatedAt": "2017-03-15T17:07:30.261Z",
      "testId": null
    },
    "relationships": {
      "test": null
    }
  }
}
```
#### Get relation (GET /:modelNamePlural/:id/relModelNamePlural)
!Not supported yet!

### Creating Resources (POST /:modelNamePlural)
Header: Content-Type: application/vnd.api+json
Request: POST /questions
Body:
```
{
	"data": {
		"type": "questions",
		"attributes": {
			"text": "New questiion, yupiii blblblblblb"
		},
		"relationships": {
			"test": {
				"data": {
					"type": "tests",
					"id": 3
				}
			}
		}
	}
}
```
Response:
```
  {
    "data": {
      "type": "questions",
      "id": 8,
      "attributes": {
        "id": 8,
        "text": "New questiion, yupiii blblblblblb",
        "updatedAt": "2017-03-16T09:12:29.966Z",
        "createdAt": "2017-03-16T09:12:29.956Z",
        "testId": 3
      }
    }
  }
```

### Updating resources (PATCH /:modelNamePlural/:id)
Header: Content-Type: application/vnd.api+json
Request: PATCH /questions/2
Body:
```
{
  "data": {
    "type": "questions",
    "attributes": {
      "text": "Change this text!"
    },
    "relationships": {
      "test": {
        "data": {
          "type": "tests",
          "id": 3
        }
      }
    }
  }
}
```
Response: 204 (No Content)

### Deleting Resources (DELETE /:modelNamePlural/:id)
Request: DELETE /questions/2
Response: 204 (No Content)


## Useful links

* [JSON API specification](http://jsonapi.org/format/)
* [Express doc](https://expressjs.com/en/4x/api.html)
* [Sequelize](http://docs.sequelizejs.com/en/v3/)
