// 1) Get the duplicated values
var searchDuplicatesGlobal = Class.create();
searchDuplicatesGlobal.prototype = {
  initialize: function() {

  },
  
  getDupes: function(qTable, dpField) { 
    var ga = new GlideAggregate(qTable);
    ga.addAggregate('COUNT', dpField);
    ga.addHaving('COUNT', dpField, '>', '1');
    ga.query(); 
    var arDupes = new Array();
    while (ga.next()) { 
      arDupes.push(ga.getValue(dpField));    
    }
    return arDupes;
  },

  type: 'getDuplicatesGlobal'
}

gs.print(getDupes(theTable, dpField));
 

// 2) Get all the records which have the duplicated field. Iterate through and do as you will.
var strQuery = "serial_numberIN" + getDupes(theTable, dpField); 
var gr = new GlideRecord(theTable);
gr.addEncodedQuery(strQuery);
gr.query();
 
while (gr.next()) {
  gs.print(gr.sys_id + " " + gr.name + " "+ gr.serial_number);
}