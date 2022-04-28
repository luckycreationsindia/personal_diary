const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
    images: {type: Array},
    status: {
        type: Boolean,
        default: false
    },
}, {timestamps: true, collection: 'categories'});

CategorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model('Category', CategorySchema, "categories");