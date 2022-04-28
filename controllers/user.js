exports.profile = async (req, res, next) => {
    if(req.user) {
        return res.json({status: "Success", data: req.user, message: "Success"});
    } else {
        return res.json({status: "Error", message: "Please Login First"});
    }
};

exports.add = async (req, res, next) => {
};

exports.update = async (req, res, next) => {
};