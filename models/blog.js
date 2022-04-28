const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    category: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    description: {type: String},
    image: {type: String},
    fromDate: {type: Schema.Types.Date, required: true, default: () => Date.now()},
    toDate: {type: Schema.Types.Date, required: true, default: () => Date.now()},
    status: {
        type: Boolean,
        default: false
    },
    tags: [],
}, {timestamps: true, collection: 'blogs'});

BlogSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model('Blog', BlogSchema, "blogs");