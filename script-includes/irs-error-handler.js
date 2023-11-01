var IRSErrorHandler = Class.create();
IRSErrorHandler.prototype = {
    initialize: function() {
    },

    /**
     * 
     * @param source <string>
     * @param logLevel <string>
     * @param errCode <string> <optional>
     * @param message <string>
     * @returns 
     */
    log: function(source, logLevel, errCode, message) {
        var err;

        // validate inputs
        if (!source || !logLevel || !message) {
            err = '[IRSErrorHandler][ERROR][000] Source, log level, and message are required.'
            gs.error(err);
            throw new Error(err);
        }

        // validate logLevel
        var validLogLevels = ['INFO', 'WARN', 'ERROR', 'LOG'];
        if (validLogLevels.indexOf(logLevel.toUpperCase()) === -1) {
            err = '[IRSErrorHandler][ERROR][001] ' + logLevel + ' is invalid. Acceptable log level values are: ' + validLogLevels.join(', ')
            gs.error(err);
            throw new Error(err);
        }

        // format message
        var formattedMessage = '[' + source + '][' + logLevel.toUpperCase() + ']';
        if (errCode) {
            formattedMessage += '[' + errCode + ']';
        }
        formattedMessage += ' ' + message;

        // log message
        try{
            switch (logLevel) {
                case 'ERROR':
                    return gs.error(formattedMessage, source);
                case 'WARN':
                    return gs.warn(formattedMessage, source);
                case 'INFO':
                    return gs.info(formattedMessage, source);
                default:
                    return gs.log(formattedMessage, source);
            }
        } catch (e) {
            err = '[IRSErrorHandler][ERROR][002] ' + e.message;
            throw new Error(err);
        }
    },
    
    type: 'IRSErrorHandler'
};