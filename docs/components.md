# Backend components

## CLI

### Seed

## Database Models

## JSON API based endpoints

## Middlewares

### Authentication

### JSON API request format validator

## Logging
### Levels
* **debug**: Useful information for debugging.
* **info**: General informations.
* **warn**: A warning. Incorrect behaviour that might end up as an error.
* **error**: Incorrect behaviour, possible information loss.
* **fatal**: Fatal error that crashes the application.

### Configuration
#### path
Path to the logging directory. Default: './'.
#### consoleLevel
Logging level on the console. Default: 'info'.
#### fileLevel
Logging level in files. Default: 'info'.
#### rotatePattern
Filename end pattern after rotation, which also defines the rotation interval. Default: '.yyyy-MM-dd.bak'.<br />
Valid meta characters in the rotatePattern are:
* **yy**: Last two digits of the year.
* **yyyy**: Full year.
* **M**: The month.
* **MM**: The zero padded month.
* **d**: The day.
* **dd**: The zero padded day.
* **H**: The hour.
* **HH**: The zero padded hour.
* **m**: The minute.
* **mm**: The zero padded minute.
* **ddd**: The weekday (Mon, Tue, ..., Sun).
#### rotateSize
Rotate the log anyway after it took up this much disk space in bytes. Rotations by size have a filename end pattern of '.n', where n is the number of size rotations in the interval defined in rotatePattern. Default: 1 000 000.

### Usage
utils/logger.js is required.
#### Module exports
* **function debug(message)**: Logs a debug message.
* **function info(message)**: Logs an info message.
* **function warn(message)**: Logs a warning message.
* **function error(message)**: Logs an error message.
* **function fatal(message)**: Logs a fatal error message.

## AKÉP integration
