let Model = require('../models/blog');

let add = (data, next) => {
    let d = new Model({
        category: data.category,
        name: data.name,
        description: data.description,
        image: data.image,
        tags: data.tags,
    });

    if (data.hasOwnProperty("status")) d.status = data.status;
    if (data.hasOwnProperty("fromDate")) d.fromDate = data.fromDate;
    else d.fromDate = Date.now();
    if (data.hasOwnProperty("toDate")) d.toDate = data.toDate;
    else d.toDate = Date.now();

    d.save((err, category) => {
        if (err) {
            if (err.code === 11000) {
                return next(new Error("Blog Already Exist"));
            }
            next(err);
        } else {
            return next(null, category);
        }
    });
}

let update = (data, next) => {
    let d = {
        category: data.category,
        name: data.name,
        image: data.image,
        description: data.description,
        status: data.status || false,
        tags: data.tags,
    }

    if (data.hasOwnProperty("status")) d.status = data.status;
    if (data.hasOwnProperty("fromDate")) d.fromDate = data.fromDate;
    if (data.hasOwnProperty("toDate")) d.toDate = data.toDate;

    Model.findByIdAndUpdate(data.id, d, {new: true}, function (err, result) {
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