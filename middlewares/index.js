let adminCheck = (req, res, next) => {
    if(req.user) {
        if(req.user.role === 1) {
            next();
        } else {
            return res.status(403).json({status: "Error", message: "Unauthorized Access"});
        }
    } else {
        return res.status(401).json({status: "Error", message: "Please Login First"});
    }
}

module.exports = {
    adminCheck
}