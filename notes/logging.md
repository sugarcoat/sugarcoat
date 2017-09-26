# Logging #

## Ask ##
We need to make a decision on what logger to use, where the logs should be, what the log level default should be, how we are going to allow users to change that log level. 

## Links ##
- [node logging basics](https://www.loggly.com/ultimate-guide/node-logging-basics/)
- [general node best practices](https://www.codementor.io/mattgoldspink/nodejs-best-practices-du1086jja)
- [logging requirements](https://blog.risingstack.com/node-js-logging-tutorial/)
- [error handling in node](https://www.joyent.com/node-js/production/design/errors)

## Thoughts ##
We should bring back the option within the config to allow users to set their log level, default should be "FATAL"/"ERROR". User should be able to log nothing at all, "FATAL"/"ERROR", "FATAL"/"ERROR" and "WARNING", "FATAL"/"ERROR", "WARNING" and "INFO", "INFO", "DEBUG", "TRACE".

SC isn't an application that allows the user to interact with it after it's been started or called. So if we have to choose between, which I think we should, "FATAL" and "ERROR", we should choose "FATAL". Mostly because SC will terminate if it runs into any problems. 

**What is the difference between an error and an exception?**
An Error is any instance of the Error class. When you throw an error it becomes an exception. (per the joyent article)

**Do we need a trace option? Wouldn't trace be dealt with mostly by debug?**

We need to include a timestamp on all logs.

**Should certain log levels output to certain places? Or should all be within one place? Or should we give the user this option?**

The errors we should be handling are "operational errors", as these are errors that are created from an outside source, ie. server, or user. 

**How are the users running SC? This should dictate where we output the errors.**
Users are going to be running SC from terminal, whether it's through a grunt/gulp task, or running a node file directly. Therefore, operational errors should be output to the terminal.

Most errors within configure.js should crash the system. There are some that are optional type of inputs that we should send out a warning, but continue with the program. 

We need to start by documenting all of our functions. 

We should be either throwing the errors within their files/functions and immediately crashing, or pass them to a callback. Never do both, per joyent's article.

From what I understand, throwing should be dealt with within a try/catch block within the function that errors out. And in our case, for passing it back to callback, we should be passing the error object back to the caller (which usually is index.js) and handling it within the catch of the promise chain.
So within configure.js, we should be throwing the errors that will crash the system, and killing all processes. And within all other files, we should be passing the error object back and having it's caller deal with the error (usually the catch within the promise chain that calls the function whether that be in index.js or some other file).

