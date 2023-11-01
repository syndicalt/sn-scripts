var certificateGR = new GlideRecord('cmdb_ci_certificate');
certificateGR.addEncodedQuery('is_self_signed=true');
certificateGR.query();

while(certificateGR.next()){
     var owner = certificateGR.owned_by;
     var ownerGroup = certificateGR.managed_by_group;
     var sysID = certificateGR.sys_id;
     var pkiGroup = gs.getProperty('sn_disco_certmgmt.cert_task_default_approval_group')
     if((!ownerGroup && owner) || (ownerGroup || !owner)) {
        var certRelationship = new GlideRecord('cmdb_rel_ci');
        certRelationship.addEncodedQuery('parent.sys_id=' + sysID + '^child.sys_class_name=cmdb_ci_computer^child.owned_by!='); //look for relationship
        certRelationship.query();

        while(certRelationship.next()) {
                var ownedBy = certRelationship.current.child.owned_by;
                var childName = certRelationship.child.name;
                var parentName = certRelationship.parent.name;
                var newIncident = new GlideRecord('incident');
                newIncident.initialize();
                newIncident.caller_id = '';
                newIncident.category = 'Security';
                newIncident.subcategory = 'Certificate';
                newIncident.contact_type = 'Self-service';
                newIncident.u_affected_ci = certRelationship.child.sys_id;
                newIncident.u_affected_ci_name = certRelationship.child.name;
                newIncident.assigned_to = ownedBy;
                newIncident.watch_list += ',' + getPKIGroupMembers(pkiGroup)
                newIncident.short_description = 'Assign self-signed certificate owner: ' + childName + 'hosted on: ' + parentName
                newIncident.description = "You have been identified as the owner of the server " + childName + "Please identify and assign the owner of the self-signed certificate: \n" + parentName + ", which is hosted on: " + parentName + "."
                //newIncident.insert();
        }
     }
}

function getPKIGroupMembers(group) {
        var res = []
        var gr = new GlideRecord('sys_user_grmember')
        gr.addEncodedQuery('group.nameSTARTSWITHDeputy')
        gr.query()

        while(gr.next()) {
gs.print(gr.user)
                res.push(gr.user.sys_id)
        }
        gs.print(res)
        return res
}