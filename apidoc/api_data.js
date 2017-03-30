define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "User Login",
    "name": "Login",
    "group": "Auth",
    "description": "<p>Authenticate user with login name and password. Returns json web token if succeed</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "loginName",
            "description": "<p>User's login name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>User's password</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6IkrDs3Nza2EgUGlzdGEiLCJuZXB0dW4iOm51bGwsImlhdCI6MTQ5MDgyMTg0OCwiZXhwIjoxNDkwODI1NDQ4fQ.CBtcX6CRSid2GuyFjeqVAP6R6kCVefWtfuRnj_Z0ISY\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "User not exist:",
          "content": "vHTTP/1.1 403 Forbidden\n{\n  \"errors\": [\n    {\n      \"title\": \"User with login name \\\"joskaspista\\\" does not exist!\"\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Incorrect password:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"errors\": [\n    {\n      \"title\": \"Incorrect password for \\\"joskapista\\\"\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "endpoints/auth/login.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/events/:id",
    "title": "Get Event",
    "name": "Get",
    "group": "Events",
    "description": "<p>Get event information with id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Event's id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"id\": 1,\n    \"date\": \"2017-03-30T12:11:17.576Z\",\n    \"location\": \"IL105\",\n    \"attempt\": 0,\n    \"createdAt\": \"2017-03-30T12:20:00.471Z\",\n    \"updatedAt\": \"2017-03-30T12:20:00.471Z\",\n    \"StudentRegistrationId\": 1\n  },\n  \"relationships\": {\n    \"StudentRegistration\": {\n      \"data\": {\n        \"id\": 1,\n        \"type\": \"StudentRegistrations\"\n      }\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "endpoints/events/get.js",
    "groupTitle": "Events"
  },
  {
    "type": "get",
    "url": "/studentregistrations/:id",
    "title": "Get StudentRegistration",
    "name": "Get",
    "group": "StudentRegistrations",
    "description": "<p>Get student registrations information with id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>StudentRegistration's id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"id\": 1,\n    \"neptunSubjectCode\": \"NEPTUN_SUBJ_CODE_1\",\n    \"neptunCourseCode\": \"NEPTUN_COURSE_CODE_1\",\n    \"createdAt\": \"2017-03-30T12:20:00.464Z\",\n    \"updatedAt\": \"2017-03-30T12:20:00.464Z\",\n    \"SemesterId\": null,\n    \"StudentGroupId\": null,\n    \"UserId\": 1\n  },\n  \"relationships\": {\n    \"Semester\": null,\n    \"StudentGroup\": null,\n    \"Events\": {\n      \"data\": [\n        {\n          \"id\": 1,\n          \"type\": \"Events\"\n        },\n        {\n          \"id\": 2,\n          \"type\": \"Events\"\n        },\n        {\n          \"id\": 3,\n          \"type\": \"Events\"\n        }\n      ]\n    },\n    \"User\": {\n      \"data\": {\n        \"id\": 1,\n        \"type\": \"Users\"\n      }\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "endpoints/studentRegistrations/get.js",
    "groupTitle": "StudentRegistrations"
  },
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Get User",
    "name": "Get",
    "group": "Users",
    "description": "<p>Get user information with id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>User's id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"id\": 1,\n    \"displayName\": \"Jósska Pista\",\n    \"loginName\": \"joskapista\",\n    \"password\": \"$2a$10$OW5JlOQM0x5Wdce48WbjZestlTG6XdOHXE0PjB6F8aima.NsgiZiO\",\n    \"email\": null,\n    \"sshPublicKey\": null,\n    \"neptun\": \"Q87XXZ\",\n    \"university\": null,\n    \"createdAt\": \"2017-03-30T12:20:00.435Z\",\n    \"updatedAt\": \"2017-03-30T12:20:00.435Z\"\n  },\n  \"relationships\": {\n    \"StudentRegistrations\": {\n      \"data\": [\n        {\n          \"id\": 1,\n          \"type\": \"StudentRegistrations\"\n        }\n      ]\n    }\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "User not exist:",
          "content": "HTTP/1.1 403 Not own user id\n{\n  \"errors\": [\n    {\n      \"title\": \"You can access only your own user\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "endpoints/users/get.js",
    "groupTitle": "Users"
  }
] });
