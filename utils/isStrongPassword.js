const minPasswordLength = 8;

module.exports = (password) => {
    let strong = true;
    let error = null;
    if (password.length < minPasswordLength) {
        strong = false;
        error = `Password length must be atleast ${minPasswordLength}`
    } 
    return { strong, error }; 
}