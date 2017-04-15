# Backend CLI

### Instructions for running CLI commands: (until official access is defined)
- open shell (cmd in windows) at backend root
- type: "npm run cli:{env} {cmd}"    
  - where {env} is the enviroment you are running in, {env} = dev  for example
  - where {cmd} is the command you want to run (will list existing commands if left blank)

### Instructions for adding new commands:
- add new command as {commandname}Cmd.js to ./bin/commands
- implement the module for the command, export it as a function
- add new require for command at the beginning of labadmin.js (save it to a const)
- add new command name to cli.parse in labadmin.js
- add new case to call the command in labadmin.js
- enjoy your new command :)

