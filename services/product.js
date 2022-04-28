let Model = require('../models/product');

let add = (data, next) => {
    let product = new Model({
        category: data.category,
        name: data.name,
        description: data.description || "",
        status: data.status || false,
        price: data.price || 0,
        tax: data.tax || 0,
        discount: data.discount || 0
    });

    if(data.hasOwnProperty("description")) product.description = data.description;
    if(data.hasOwnProperty("images")) product.images = data.images;
    if(data.hasOwnProperty("status")) product.status = data.status;
    if(data.hasOwnProperty("price")) product.price = data.price;
    if(data.hasOwnProperty("tax")) product.tax = data.tax;
    if(data.hasOwnProperty("discount")) product.discount = data.discount;

    product.save((err, result) => {
        if (err) {
            if (err.code === 11000) {
                return next(new Error("Product Already Exist"));
            }
            next(err);
        } else {
            return next(null, result);
        }
    });
}

let update = (data, next) => {
    let product = {
        category: data.category,
    }

    if(data.hasOwnProperty("name")) product.name = data.name;
    if(data.hasOwnProperty("description")) product.description = data.description;
    if(data.hasOwnProperty("images")) product.images = data.images;
    if(data.hasOwnProperty("status")) product.status = data.status;
    if(data.hasOwnProperty("price")) product.price = data.price;
    if(data.hasOwnProperty("tax")) product.tax = data.tax;
    if(data.hasOwnProperty("discount")) product.discount = data.discount;

    Model.findByIdAndUpdate(data.id, product, {new: true}, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return next(null, result);
        }
    });
}

let load = (data, next) => {
    let filter = {status: true};
    if(data && data.hasOwnProperty('cid')) {
        filter['category'] = data.cid;
    }
    Model.find(filter, (err, result) => {
        if (err) {
            next(err);
        } else {
            next(null, result);
        }
    });
}

let loadAll = (data, next) => {
    let filter = {};
    if(data && data.hasOwnProperty('cid')) {
        filter['category'] = data.cid;
    }
    Model.find(filter, (err, result) => {
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