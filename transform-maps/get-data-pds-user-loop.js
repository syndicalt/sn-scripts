/**
* @function updateUsers
* @returns null
* @description - This function will loop through all sys_user records
* that have an seid, process data from a pds api 
 * call, and update the user's profile and update or create the user's
* hrprofile.
*/
function updateUsers() {
    var gr = new GlideRecord('sys_user');
    //gr.setLimit(10000);
    gr.query();

    while(gr.next()) {
        if(gr.user_name.length > 5) continue;
        
        var r = new sn_ws.RESTMessageV2('PDS Global', 'Get By SEID');

        r.setStringParameterNoEscape('seid', gr.user_name);

        var response = r.execute(),
            responseBody = response.getBody(),
            httpStatus = response.getStatusCode(),
            res = JSON.parse(responseBody);

        if(httpStatus !== 200) { 
            gs.error('[PDS-updateUsers] API Error: ' + httpStatus + ', Message: ' + res, 'PDS');
            continue;
        }

        if(res.length === 0) {
            gs.log('[PDS-updateUsers] Data: ' + gr.user_name + ' not found in PDS!', 'PDS');
            continue;
        }
        
        /** update sys_user record */
        gr.title = res[0].jobTitle;
        gr.update();
        /** update hr profile */
        hrOperations(gr.sys_id, res)

        gs.info('[PDS-updateUser] User data updated for ' + gr.user_name, 'PDS');
    }
}

/**
* @function hrOperations
* @param {string} id 
* @param {object} obj 
* @param {string} oper
* @description - this function will create or update the HR profile. 
* @returns null
*/
function hrOperations(id, obj) {
    var hr = {},
    hrProfile;
    //dpt = obj.department.code;

    hr.contractor = obj.isContractor == 'N' ? false : true;
    hr.work_phone = obj.phone.desk;
    hr.mobile_phone = obj.phone.mobile;
    hr.personal_email = obj.mail;
    hr.u_work_schedule = obj.workSchedule;
    hr.u_tour_code = obj.tourCode;
    hr.u_pay_grade = obj.payGrade;
    hr.u_retirement_code = obj.retirement.code;
    hr.u_retirement_title = obj.retirement.title;
    hr.u_tour_name = obj.tourName;
    hr.u_pay_series = obj.paySeries;
    hr.u_pay_step = obj.payStep;
    hr.u_pay_plan = obj.payPlan;
    hr.department = obj.department.code;
    hr.u_employee_status = obj.employeeStatus;
    hr.employment_end_date = getSnDate(obj.separationDate);
    hr.employment_start_date = getSnDate(obj.enterOnDuty);

    if(new sn_hr_core.pbsApiUtil().isHrProfile(id)){
        try{
            hrProfile = new sn_hr_core.pbsApiUtil();
            hrProfile.updateHrProfile(id, JSON.stringify(hr));
            gs.info('[PDS-hrOperations] hr profile updated for ' + id, 'PDS');
            return true; 
        }catch(e) {
            gs.error('[PDS] Error: ' + e, 'PDS');
        }
    }
        
    try{
        hrProfile = new sn_hr_core.hr_UserToProfileMigration();
        hrProfile.createProfilesFromQuery('sys_id=' + id, JSON.stringify(hr));
        gs.info('[PDS-hrOperations] hr profile created for ' + id, 'PDS');
        return true;
    }catch(e) {
        gs.error('[PDS] Error: ' + e, 'PDS');
    }
}

/**
* @function getSnDate
* @param {string} string 
* @returns date
* @description - This function will convert the date string to a date object.
*/
function getSnDate(string) {
    var date = string,
    gdt = new GlideDateTime();

    gdt.setDisplayValue(date);

    return date;
}


try{
    updateUsers();
} catch(e) {
    gs.error('[PDS] Error: ' + e, 'PDS');
}
