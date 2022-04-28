let Service = require('../services/blog');

exports.add = async (req, res, next) => {
    if (!req.body.name) {
        return res.json({status: 'Error', message: 'Blog Name is Required.'});
    }
    if (!req.body.description) {
        return res.json({status: 'Error', message: 'Blog Description is Required.'});
    }
    if (!req.body.category) {
        return res.json({status: 'Error', message: 'Blog Category is Required.'});
    }

    Service.add(req.body, (err, result) => {
        if(err) {
            next(err);
        } else {
            return res.json({status: "Success", message: "Blog Added Successfully", data: result});
        }
    });
};

exports.update = async (req, res, next) => {
    if (!req.body.name) {
        return res.json({status: 'Error', message: 'Blog Name is Required.'});
    }
    if (!req.body.description) {
        return res.json({status: 'Error', message: 'Blog Description is Required.'});
    }
    if (!req.body.id) {
        return res.json({status: 'Error', message: 'Blog ID is Required.'});
    }
    if (!req.body.category) {
        return res.json({status: 'Error', message: 'Blog Category is Required.'});
    }

    Service.update(req.body, (err, result) => {
        if(err) {
            next(err);
        } else {
            return res.json({status: "Success", message: "Blog Updated Successfully", data: result});
        }
    });
};

exports.load = async (req, res, next) => {
    Service.load(req.body, (err, result) => {
        if(err) {
            next(err);
        } else {
            return res.json({status: "Success", message: "Success", data: result});
        }
    });
};

exports.loadAll = async (req, res, next) => {
    Service.load(req.body, (err, result) => {
        if(err) {
            next(err);
        } else {
            return res.json({status: "Success", message: "Success", data: result});
        }
    });
};