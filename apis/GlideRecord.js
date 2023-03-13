const incident = require('./DummyRecords').incident

class GlideRecord {
    constructor(props) {
        this.initialize(props)
    }

    initialize(props) {
        this.table = props
    }

    addQuery(a, b, c){
        this.queryField = a
        if(arguments.length === 2) {
            this.queryMethod = '='
            this.queryValue = b
            return
        }

        this.queryMethod = b
        this.queryValue = c
        return
    }

    addLimit(limit) {
        this.limit = limit
    }

    addEncodedQuery(query) {
        this.query = query
    }

    addActiveQuery() {
        this.activeQuery = true
    }

    addJoinQuery(table, field, value) {
        this.joinTable = table
        this.joinField = field
        this.joinValue = value
    }

    addAggregate(aggregate) {
        this.aggregate = aggregate
    }

    query() {
        console.log(this.table)
        switch(this.table) {
            case 'incident':
                return JSON.stringify(incident)
                break
            default:
                throw new Error()
                break
        }
    }
}

module.exports = GlideRecord