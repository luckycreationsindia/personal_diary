let Model = require('../models/banner');

let add = (data, next) => {
    let category = new Model({
        name: data.name,
        image: data.image
    });

    if(data.hasOwnProperty("description")) category.description = data.description;
    if(data.hasOwnProperty("status")) category.status = data.status;

    category.save((err, category) => {
        if (err) {
            if (err.code === 11000) {
                return next(new Error("Banner Already Exist"));
            }
            next(err);
        } else {
            return next(null, category);
        }
    });
}

let update = (data, next) => {
    let banner = {
        name: data.name,
        image: data.image,
        description: data.description || "",
        status: data.status || false
    }

    if(data.hasOwnProperty("description")) banner.description = data.description;
    if(data.hasOwnProperty("status")) banner.status = data.status;

    Model.findByIdAndUpdate(data.id, banner, {new: true}, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return next(null, result);
        }
    });
}

let load = (data, next) => {
    Model.find({status: true}, (err, result) => {
        if (err) {
            next(err);
        } else {
            next(null, result);
        }
    });
}

let loadAll = (data, next) => {
    Model.find({}, (err, result) => {
        if (err) {
            next(err);
        } else {
            next(null, result);
        }
    });
}

module.exports = {
    add,
    update,
    load,
    loadAll
}