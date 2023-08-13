import-module activedirectory -warningaction "SilentlyContinue";
$SamAccountName = $SamAccountName -replace "%27","'";
$user = Get-ADUser -Identity $SamAccountName -Credential $cred -Server $computer;

#### USER AND LOCATION INFO ####
if($st){
    $st = $st -replace "%27","'";
    $user.st =    $st;
}
if($displayName){
    $displayName = $displayName -replace "%27","'";
    $user.DisplayName =    $displayName;
}
if($givenName){
    $givenName = $givenName -replace "%27","'";
    $user.GivenName =    $givenName;
}
if($postalCode){
    $postalCode = $postalCode #-replace "%27","'";
    $user.Postalcode =    $postalCode;
}
if($extensionAttribute6){
    $extensionAttribute6 = $extensionAttribute6 -replace "%27","'";
    $user.extensionAttribute6 =    $extensionAttribute6;
}
if($L){
    $L = $L -replace "%27","'";
    $user.L =    $L;
}
if($Manager){
    $Manager = $Manager -replace "%27","'";
    $user.Manager =    $Manager;
}
if($mobile){
    $mobile = $mobile -replace "%27","'";
    $user.mobile =    $mobile;
}
if($phone){
    $phone = $phone -replace "%27","'";
    $user.telephoneNumber =    $phone;
}
if($street){
    $street = $street -replace "%27","'";
    $user.StreetAddress =    $street;
}
if($Surname){
    $surname  = $surname  -replace "%27","'";
    $user.Surname =    $surname;
}
if($middleName){
    $middleName = $middleName -replace "%27","'";
    $user.MiddleName =    $middleName;
}
if($preferredName){
    $preferredName  = $preferredName  -replace "%27","'";
    $user.PreferredName =    $preferredName;
}
if($extensionAttribute13){
    $extensionAttribute13 = $extensionAttribute13 -replace "%27","'";
    $user.extensionAttribute13 =    $extensionAttribute13;
}

#### ORG INFO ####
if($division){
    $division  = $division -replace "%27","'";
    $user.Division =    $division;
}
if($hireDate){
    $hireDate = $hireDate -replace "%27","'";
    $user.hireDate =    $hireDate;
}
if($extensionAttribute3){
    $extensionAttribute3 = $extensionAttribute3 -replace "%27","'";
    $user.extensionAttribute3 =    $extensionAttribute3;
}
if($department){
    $department = $department -replace "%27","'";
    $user.Department =    $department;
}
if($jobTitle){
    $jobTitle = $jobTitle -replace "%27","'";
    $user.Title =    $jobTitle;
}
if($extensionAttribute11){
    $extensionAttribute11 = $extensionAttribute11 -replace "%27","'";
    $user.extensionAttribute11 =    $extensionAttribute11;
}
if($employeeType){
    $employeeType = $employeeType -replace "%27","'";
    $user.employeeType =    $employeeType;
}

$result = Set-ADUser -Instance $user -Credential $cred -Server $computer;