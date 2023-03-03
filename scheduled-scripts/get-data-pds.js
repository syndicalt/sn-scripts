/** 
 * @function getData
 * @param {int} start_index - start index of the API call
 * @param {int} end_index - end index of the API call
 * @returns null
 * @description - This function will call the PDS Global API and pass the start and end index.
 */
function getData(start_index,end_index) {
    var r = new sn_ws.RESTMessageV2('PDS Global', 'Default GET');
    r.setStringParameterNoEscape('end_index', end_index);
    r.setStringParameterNoEscape('start_index', start_index);

    var response = r.execute(),
        responseBody = response.getBody(),
        httpStatus = response.getStatusCode(),
        obj = JSON.parse(responseBody);
    
    if(httpStatus !== 200) {
        gs.error('[PDS-getData] API Error: ' + httpStatus + ', Message: ' + obj);
        gs.sleep(60000)
        getData(start_index, end_index);
        return
    }

    if(obj.length === 0) return;

    obj.forEach(function(item){
        processData(item)
    })
    
    try{
        getData(start_index + 99, end_index + 99);
    } catch(e){
        var msg = e.message;
        
        gs.error('[PDS-getData] Error: ' + msg);
        return false
    }
}

/**
 * @function processData 
 * @param {object} obj 
 * @returns null
 * @description - This function will process the data from the API call and update the user's profile.
 */
function processData(obj) {
    if(obj.seid == null) return;
    
    var id = getSeid(
        obj.seid.toString(), 
        obj.jobTitle
    );
    
    if(!id){
        gs.warn("[PDS-processData] processData: " + obj.seid + " does not exist! Skipping...");
        return;
    }
    
    if(new sn_hr_core.pbsApiUtil().isHrProfile(id)){
        hrOperations(id, obj, 'update');
        return;
    } else {
        hrOperations(id, obj, 'create');
        return;
    }
}

/**
 * @function getSeid
 * @param {string} seid 
 * @param {string} str 
 * @returns string
 */
function getSeid(seid, str) {
    var gr = new GlideRecord("sys_user");
    if(gr.get("user_name", seid)){
        //update user's title in sys_user
        if(str){
            gr.title = str;
            gr.update();
        }

        return gr.sys_id.toString();
    } else {
        gs.warn("[PDS-getSeid] getSeid: " + seid + " was not found!");
        return false;
    }
}

/**
 * @function hrOperations
 * @param {string} id 
 * @param {object} obj 
 * @param {string} oper
 * @description - This function will create or update the HR profile. 
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
        return;
    } else {
        hrProfile = new sn_hr_core.pbsApiUtil();
        hrProfile.updateHrProfile(id, JSON.stringify(hr));
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

try {
    getData(1, 99);
} catch(e) {
    var msg = e.message;

    gs.error('[PDS-GetData] Error: ' + msg);
    return false
}
