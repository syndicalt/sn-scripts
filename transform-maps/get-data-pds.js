/**
 * @function runTransformScript
 * @param {object} source - source record from ldap
 * @param {object} map - transform map
 * @param {object} log - log object
 * @param {object} target - target record from sys_user
 * @returns null
 * @description - This function will process data from a pds api 
 * call and update the user's profile and hrprofile.
 */
(function runTransformScript(source, map, log, target){
    log.info('[PDS-runTransformScript] Initialize!')
    var seid = source.u_samaccountname,
        user_sysId = target.sys_id.toString(),
        query = getPDSData(seid),
        responseBody = query.getBody(),
        httpStatus = query.getStatusCode(),
        res = JSON.parse(responseBody);

    if(httpStatus !== 200) {
        log.error('[PDS-runTransformScript] API Error: ' + httpStatus + ', Message: ' + res);
        return false;
    }

    if(res.length === 0) {
        log.info('[PDS-runTransformScript] No PDS data found for ' + seid);
        return false;
    }

    /** update user record */
    target.title = res[0].jobTitle;
    target.update();

    /** update hr profile */
    if(new sn_hr_core.pbsApiUtil().isHrProfile(user_sysId)){
        hrOperations(user_sysId, res, 'update');
    } else {
        hrOperations(user_sysId, res, 'create');
    }

    log.info('[PDS-runTransformScript] PDS data updated for ' + seid);
    return true;
});

/**
 * @function getPDSData
 * @param {string} seid
 * @returns object
 * @description - this function will call the pds api and return the data.
 */
function getPDSData(seid) {
    var r = new sn_ws.RESTMessageV2('PDS Global', 'Default GET');
    r.setStringParametersNoEscape('seid', seid);
    var response = r.execute()

    return response;
}

/**
 * @function hrOperations
 * @param {string} id 
 * @param {object} obj 
 * @param {string} oper
 * @description - this function will create or update the HR profile. 
 * @returns null
 */
function hrOperations(id, obj, oper) {
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
    hr.u_department_code = obj.department.code;
    hr.u_employee_status = obj.employeeStatus;
    hr.employment_end_date = getSnDate(obj.separationDate);
    hr.employment_start_date = getSnDate(obj.enterOnDuty);

    if(oper === 'create') {
        hrProfile = new sn_hr_core.hr_UserToProfileMigration();
        hrProfile.createProfilesFromQuery('sys_id='+id, JSON.stringify(hr));
        log.info('[PDS-hrOperations] hr profile created for ' + id);
        return;
    } else {
        hrProfile = new sn_hr_core.pbsApiUtil();
        hrProfile.updateHrProfile(id, JSON.stringify(hr));
        log.info('[PDS-hrOperations] hr profile updated for ' + id);
        return;
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