module.exports = function(val) {
    const minPhoneNumber = 1000000000;
    const maxPhoneNumber = 9999999999;
    const has10Digits = ((val > minPhoneNumber) && (val < maxPhoneNumber))
    return has10Digits; 
}