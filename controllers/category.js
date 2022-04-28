let Service = require('../services/category');

exports.add = async (req, res, next) => {
    if (!req.body.name) {
        return res.json({status: 'Error', message: 'Category Name is Required.'});
    }

    Service.add(req.body, (err, result) => {
        if(err) {
            next(err);
        } else {
            return res.json({status: "Success", message: "Category Added Successfully", data: result});
        }
    });
};

exports.update = async (req, res, next) => {
    if (!req.body.name) {
        return res.json({status: 'Error', message: 'Category Name is Required.'});
    }
    if (!req.body.id) {
        return res.json({status: 'Error', message: 'Category ID is Required.'});
    }

    Service.update(req.body, (err, result) => {
        if(err) {
            next(err);
        } else {
            return res.json({status: "Success", message: "Category Updated Successfully", data: result});
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
    Service.loadAll(req.body, (err, result) => {
        if(err) {
            next(err);
        } else {
            return res.json({status: "Success", message: "Success", data: result});
        }
    });
};