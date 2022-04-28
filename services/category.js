let Model = require('../models/category');

let add = (data, next) => {
    let category = new Model({
        name: data.name
    });

    if(data.hasOwnProperty("description")) category.description = data.description;
    if(data.hasOwnProperty("images")) category.images = data.images;
    if(data.hasOwnProperty("status")) category.status = data.status;

    category.save((err, category) => {
        if (err) {
            if (err.code === 11000) {
                return next(new Error("Category Already Exist"));
            }
            next(err);
        } else {
            return next(null, category);
        }
    });
}

let update = (data, next) => {
    let category = {
        name: data.name,
        description: data.description || "",
        status: data.status || false
    }

    if(data.hasOwnProperty("name")) category.name = data.name;
    if(data.hasOwnProperty("description")) category.description = data.description;
    if(data.hasOwnProperty("images")) category.images = data.images;
    if(data.hasOwnProperty("status")) category.status = data.status;

    Model.findByIdAndUpdate(data.id, category, {new: true}, function (err, result) {
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