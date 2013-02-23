// Currency codes are in ISO 4127 format
// http://en.wikipedia.org/wiki/Currency_codes

var feeds = [
    { 'name': "MANUTD", 'currency': 'GBP'  },
    { 'name': "FCBARC", 'currency': 'EUR' },
    { 'name': "REALMD", 'currency': 'EUR' },
    { 'name': "REDSOX", 'currency': 'USD' },
    { 'name': "KOLKNI", 'currency': 'INR' },
    { 'name': "AJAXAM", 'currency': 'EUR' },
    { 'name': "ACMLAN", 'currency': 'EUR' },
    { 'name': "CHLSEA", 'currency': 'GBP' },
    { 'name': "TOTHOT", 'currency': 'GBP' },
    { 'name': "ARSNAL", 'currency': 'GBP' },
    { 'name': "GBPACK", 'currency': 'USD' },
    { 'name': "SFGIAN", 'currency': 'USD' },
    { 'name': "PARISG", 'currency': 'EUR' },
    { 'name': "BAYERN", 'currency': 'EUR' }
];

exports.fetch = function(){
    return feeds;
}