# Logging #

## Ask ##
We need to make a decision on what logger to use, where the logs should be, what the log level default should be, how we are going to allow users to change that log level. 

## Links ##
- [node logging basics](https://www.loggly.com/ultimate-guide/node-logging-basics/)
- [general node best practices](https://www.codementor.io/mattgoldspink/nodejs-best-practices-du1086jja)
- [logging requirements](https://blog.risingstack.com/node-js-logging-tutorial/)
- [error handling in node](https://www.joyent.com/node-js/production/design/errors)
- [error handling best practices](http://goldbergyoni.com/checklist-best-practices-of-node-js-error-handling/)

## Thoughts/Notes ##
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

Most errors within configure.js should crash the system. There are some that are optional type of inputs that we should send out a warning, but continue with the program. These are called "programmer errors". We should be dealing with these because we explicitly state in the documentation what each config item is expecting, and if we don't get that, we will error.

Errors within render and parser are more than likely programmer errors (in the sense that they are errors because they are bugs), that we should attempt to deal with ourselves, and if we can't we will need to crash and error out. Unless, comment serializer can't be reached or errors out, then that would be a operational error.

a **restarter** is a function that is called when the program fails when it shouldn't, and restarts the program in hopes that the issue will be resolved by running the processes over from start. **Will this be helpful in parser or render?**

__We need to start by documenting all of our functions.__

We should be either throwing the errors within their files/functions and immediately crashing, or pass them to a callback. Never do both, per joyent's article.

From what I understand, throwing should be dealt with within a try/catch block within the function that errors out. And in our case, for passing it back to callback, we should be passing the error object back to the caller (which usually is index.js) and handling it within the catch of the promise chain.
So within configure.js, we should be throwing the errors that will crash the system, and killing all processes. And within all other files, we should be passing the error object back and having it's caller deal with the error (usually the catch within the promise chain that calls the function whether that be in index.js or some other file).

If we decide to log within a log file, we will have to keep track of the errors as well and output them there as well as sending them within the rejected promise object. Which then doesn't that make it useless for the users to have to deal with errors within their promise? 

**If we decide to log outside of a log file, where will those logs go? Should we be returning the logs back to the user so that they can take them as they please?**

## Next Steps ##
    1. Document functions
        - state functions' arguments (their types, and constraints)
        - state what the function returns
        - state what errors could happen
        - state what those errors mean for the rest of the program
    2. Decide on the log levels are allowed within SC
        - nothing at all
        - "FATAL"/"ERROR"
        - "FATAL"/"ERROR" and "WARNING"
        - "FATAL"/"ERROR", "WARNING" and "INFO"
        - "INFO"
        - "DEBUG"
        - "TRACE"
    3. Decide on where the logs will be output
        - log file
        - terminal


## Decisions ##
We will, for first release, log all logs into the terminal, depending on which log level the user chooses. And assume that if they will be logging the errors they get from a rejected promise into the terminal as well. The log levels we should include are: silent, info, and warning. 
__This may change if anything different comes up when documenting all functions.__