var staging_table = request.params.table,
    requestBody = request.body.data,
    responseBody = {},
    data = requestBody.data,
    sID, 
    impSet

//Make sure the payload exists in the request
if (data && typeof(data) === undefined && data.length === 0) {
    response.setStatus('400')
    responseBody.error = 'Please provide format in the following spec: {data:[]}.'
    response.setBody(responseBody)
    return
} 

var size = 10000, //10 for testing;
    i = 0,
    len = data.length,
    gr = new GlideRecord(staging_table);

if (data.length > size) {
    //multiple import sets
    var arr = data.splice(0, size)

    for (i = 0; i < arr.length; i++) {
        gr.initialize()
        
        for(key in arr[i]) {
            gr[key] = arr[i]
        }

        sID = gr.insert()
        //retrieve Import Set sys_id from the last record inserted in the batch
        if (i == arr.length - 1) impSet = getImportSet(sID)
    }
    //close the active import set
    closeImportSet(impSet)
} else {
    //just 1 import set
    for (i = 0; i < data.length; i++) {
        gr.initialize();
        for(key in arr[i]) {
            gr[key] = arr[i]
        }

        sID = gr.insert()
        //retrieve Import Set sys_id from the last record inserted in the batch
        if (i == data.length - 1) impSet = getImportSet(sID)
    }
    //close the active import set
    closeImportSet(impSet)
}

response.setStatus('201')
responseBody.size = len
response.setBody(responseBody)

//Return the import set sys id as a string
function getImportSet(sID) {
    var grSHCJMS = new GlideRecord(staging_table)
    if (grSHCJMS.get(sID)) return String(grSHCJMS.sys_import_set)
}

// Close the import set
function closeImportSet(impSet) {
    var util = new global.HRIntegrationsUtils()
    util.setImportSetState(impSet, 'processed')
}