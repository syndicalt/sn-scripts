_decodeCSR: function() {
    var res, csr = this.getParameter('sysparm_csr')
    
    try{
        var j = apiPost(csr)
        
        if(j.status !== 200) {
            res.status = j.status
            res.message = j.message

            return res
        }
        
        return j
    } catch(e) {
        res.status = 500,
        res.message = e
        
        return res
    }
    
    function apiPost(str) {
        var req, res, jsonData = {}
        
        req = new sn_ws.RESTMessageV2()
        req.setEndpoint('https://secure.sectigo.com/products/!decodeCSR?csr=' + encodeURIComponent(str.replace(/\n/g, '')))
        req.setHttpMethod('POST')
        req.setRequestHeader('Accept', 'application/json')
        req.setRequestHeader('Content-Type', 'application/json')
        res = req.execute()
        jsonData.status = res.getStatusCode()
        jsonData.message = jsonFormat(res.getBody())
        
        return jsonData
    }
    
    function jsonFormat(str) {
        var resJson = res.split('\n').reduce(function(acc, curr) {
            var keyVal = curr.split('=')
            acc[keyVal[0]] = keyVal[1]

            return acc
        }, {})
    }
}