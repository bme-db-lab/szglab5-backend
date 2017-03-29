define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "User Login",
    "name": "Login",
    "group": "Auth",
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
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"errors\": [\n    {\n      \"title\": \"User with login name \\\"joskaspista\\\" does not exist!\"\n    }\n  ]\n}",
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
  }
] });