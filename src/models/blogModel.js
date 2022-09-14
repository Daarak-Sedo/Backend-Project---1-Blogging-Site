const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    authorId: {
        type: ObjectId,
        ref: "Author",
        required: true,
        trim: true,
        unique: true,

    },
    tags: {
        type: [String],
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subCategory: {
        type: [String],
        trim: true
    },
    deletedAt: {
        type: Date,
        require: true,
        default: Date.now
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },

    publishedAt: {
        type: Date,
        require: true,
        default: Date.now
    },

    isPublished: {
        type: Boolean,
        default: true,
    },

}, { timestamps: true });


module.exports = mongoose.model('Blog', blogSchema)