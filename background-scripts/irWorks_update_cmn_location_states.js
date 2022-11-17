/*
Update cmn_location for state field to convert state full name to abbreviation.

Author: Nicholas Blanchard
*/

var states = [
        {"name":"Alabama","abbreviation":"AL"},
        {"name":"Alaska","abbreviation":"AK"},
        {"name":"Arizona","abbreviation":"AZ"},
        {"name":"Arkansas","abbreviation":"AR"},
        {"name":"California","abbreviation":"CA"},
        {"name":"Colorado","abbreviation":"CO"},
        {"name":"Connecticut","abbreviation":"CT"},
        {"name":"Delaware","abbreviation":"DE"},
        {"name":"Florida","abbreviation":"FL"},
        {"name":"Georgia","abbreviation":"GA"},
        {"name":"Hawaii","abbreviation":"HI"},
        {"name":"Idaho","abbreviation":"ID"},
        {"name":"Illinois","abbreviation":"IL"},
        {"name":"Indiana","abbreviation":"IN"},
        {"name":"Iowa","abbreviation":"IA"},
        {"name":"Kansas","abbreviation":"KS"},
        {"name":"Kentucky","abbreviation":"KY"},
        {"name":"Louisiana","abbreviation":"LA"},
        {"name":"Maine","abbreviation":"ME"},
        {"name":"Maryland","abbreviation":"MD"},
        {"name":"Massachusetts","abbreviation":"MA"},
        {"name":"Michigan","abbreviation":"MI"},
        {"name":"Minnesota","abbreviation":"MN"},
        {"name":"Mississippi","abbreviation":"MS"},
        {"name":"Missouri","abbreviation":"MO"},
        {"name":"Montana","abbreviation":"MT"},
        {"name":"Nebraska","abbreviation":"NE"},
        {"name":"Nevada","abbreviation":"NV"},
        {"name":"New Hampshire","abbreviation":"NH"},
        {"name":"New Jersey","abbreviation":"NJ"},
        {"name":"New Mexico","abbreviation":"NM"},
        {"name":"New York","abbreviation":"NY"},
        {"name":"North Carolina","abbreviation":"NC"},
        {"name":"North Dakota","abbreviation":"ND"},
        {"name":"Ohio","abbreviation":"OH"},
        {"name":"Oklahoma","abbreviation":"OK"},
        {"name":"Oregon","abbreviation":"OR"},
        {"name":"Pennsylvania","abbreviation":"PA"},
        {"name":"Rhode Island","abbreviation":"RI"},
        {"name":"South Carolina","abbreviation":"SC"},
        {"name":"South Dakota","abbreviation":"SD"},
        {"name":"Tennessee","abbreviation":"TN"},
        {"name":"Texas","abbreviation":"TX"},
        {"name":"Utah","abbreviation":"UT"},
        {"name":"Vermont","abbreviation":"VT"},
        {"name":"Virginia","abbreviation":"VA"},
        {"name":"Washington","abbreviation":"WA"},
        {"name":"West Virginia","abbreviation":"WV"},
        {"name":"Wisconsin","abbreviation":"WI"},
        {"name":"Wyoming","abbreviation":"WY"},
        {"name":"Newfoundland and Labrador","abbreviation":"NL"},
        {"name":"Prince Edward Island","abbreviation":"PE"},
        {"name":"Nova Scotia","abbreviation":"NS"},
        {"name":"New Brunswick","abbreviation":"NB"},
        {"name":"Quebec","abbreviation":"QC"},
        {"name":"Manitoba","abbreviation":"MB"},
        {"name":"Saskatchewan","abbreviation":"SK"},
        {"name":"Alberta","abbreviation":"AB"},
        {"name":"British Columbia","abbreviation":"BC"},
        {"name":"Yukon","abbreviation":"YT"},
        {"name":"Northwest Territories","abbreviation":"NT"},
        {"name":"Nunavut","abbreviation":"NU"}]

states.forEach(function(state){
    var gr = new GlideRecord('cmn_location')
    gr.addQuery('state',state.name)
    gr.query()
    if(gr.next()) {
        gr.state = state.abbreviation
        gr.update()
    }
})