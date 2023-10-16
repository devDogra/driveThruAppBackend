const allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const role = req.user.role; 
    
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ error: "Insufficient priviliges" });
        }
    
        next();
    
    }
}

module.exports = allowRoles; 