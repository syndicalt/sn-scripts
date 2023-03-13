class GlideSystem {
    constructor(props) {
        this.initialize(props)
    }

    initialize(props) {
        console.log(props)
    }

    /** log operations  */
    log(message, source) {
        console.log(message)
        console.log(source)
    }

    warn(message, source) {
        console.warn(message)
        console.log(source)
    }

    error(message, source) {
        console.error(message)
        console.log(source)
    }

    debug(message, source) {
        console.debug(message)
        console.log(source)
    }
    /** end log operations */

    /** form operations */
    addInfoMessage(message) {
        console.log(message)
    }

    addErrorMessage(message) {
        console.error(message)
    }

    addWarningMessage(message) {
        console.warn(message)
    }

    addMessage(type, message) {
        console.log(type, message)
    }
    /** end form operations */

    /** date operations */
    daysAgo(days) {
        return new Date().getTime() - (days * 24 * 60 * 60 * 1000)
    }

    now() {
        return new Date().getTime()
    }

    dateGenerate(date, range) {
        return new Date().getTime()
    }

    getDateTime() {
        return new Date().getTime()
    }
    /** end date operations */
}

module.exports = GlideSystem