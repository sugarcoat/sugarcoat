# Logging #

## Ask ##
We need to make a decision on what logger to use, where the logs should be, what the log level default should be, how we are going to allow users to change that log level. 

## Links ##
- [node logging basics](https://www.loggly.com/ultimate-guide/node-logging-basics/)
- [general node best practices](https://www.codementor.io/mattgoldspink/nodejs-best-practices-du1086jja)

## Thoughts ##
We should bring back the option within the config to allow users to set their log level, default should be "FATAL"/"ERROR". User should be able to log nothing at all, "FATAL"/"ERROR", "FATAL"/"ERROR" and "WARNING", "FATAL"/"ERROR", "WARNING" and "INFO", "INFO", "DEBUG", "TRACE".

SC isn't an application that allows the user to interact with it after it's been started or called. So if we have to choose between, which I think we should, "FATAL" and "ERROR", we should choose "FATAL". Mostly because SC will terminate if it runs into any problems. 

What is the difference between an error and an exception?

Do we need a trace option? Wouldn't trace be dealt with mostly by debug?

