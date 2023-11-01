(function executeRule(current, previous /*null when async*/) {

        //Declare and format table header array
        var date = new GlideDate()
        var fileName = current.suject_common_name + '_' + date;
        var txtContent = current.csr; //will store content of CSV file
        var TaskSys_id = current.sys_id; //It is holging sys_id of incident record to which we are going to attach CSV file
        var attachmentSysID = current.sys_id;; //will store sys_id of attachment

        //Attaching CSV file to Incident record
        var grIncRec = new GlideRecord("task"); // CHANGE THIS TO CERTIFICATE TASK TABLE
        grIncRec.addQuery("sys_id", TaskSys_id);
        grIncRec.query();
        if (grIncRec.next()) {
            var grIncAttachment = new GlideSysAttachment();
            grIncAttachment.write(grIncRec, fileName, 'text/csv', txtContent);

            //Getting sys_id of Attachment record from Attachments table
            var grIncrAttachment = new GlideRecord('sys_attachment');
            grIncrAttachment.addQuery('table_sys_id', TaskSys_id);
            grIncrAttachment.query();
            if (grIncrAttachment.next()) {
                gs.log('Report is ready to download!' + grIncrAttachment.sys_id);
                attachmentSysID = grIncrAttachment.sys_id;
            }
        }

        //Handle the attachment and sending of the XLS file to the shared drive

        var sharedDrivePath = "\\SERVER_NAME\SHARE_NAME"; // REPLACE WITH SHARED DRIVE PATH
        var attachmentSysID = current.getValue("u_xls_attachment"); // REPLACE???

        if (attachmentSysID) {
            var attachmentGR = new GlideRecord("sys_attachment");
            if (attachmentGR.get(attachmentSysID)) {
                var fileName = attachmentGR.getValue("file_name");
                var fileContent = GlideSysAttachment.getContent(attachmentGR);

                // You may need to handle the file naming and folder structure accordingly.
                // For example, you could include the incident number or timestamp in the file name.

                // Example: var filePath = sharedDrivePath + "\\" + current.number + "_" + fileName;
                var filePath = sharedDrivePath + "\\" + fileName;

                // Writing the file to the shared drive.
                var file = new global.JSUtil().writeBase64toFile(filePath, fileContent);

                // Handle any error checking and logging as required.

            }
})(current, previous);