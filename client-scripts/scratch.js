const arr = {
    "Database": [
        "Database"
    ],
    "Email": [
        "Email"
    ],
    "Hardware": [
        "Phone",
        "Hardware",
        "Printing"
    ],
    "Network": [
        "Network","Network - LAN Failure",
        "Network - WAN Failure",
        "Network - Wireless LAN (WLAN)",
        "Network - User Access"
    ],
    "Security": [
        "Security - Event or Vulnerability",
        "Security - User Access Issue"
    ],
    "Software": [
        "Messaging/Video Collaboration",
        "Software",
        "Workstation Application Issue",
        "Business System Application Issue"
    ]
}

const kbCategory = 'Database'
let res

if(arr['Database'].indexOf(kbCategory) > -1) res = 'Database'
if(arr['Email'].indexOf(kbCategory) > -1) res = 'Email'
if(arr['Hardware'].indexOf(kbCategory) > -1) res = 'Hardware'
if(arr['Network'].indexOf(kbCategory) > -1) res = 'Network'
if(arr['Security'].indexOf(kbCategory) > -1) res = 'Security'
if(arr['Software'].indexOf(kbCategory) > -1) res = 'Software'

console.log(res)