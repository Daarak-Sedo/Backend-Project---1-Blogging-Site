const blogModel = require("../models/blogModel")
const mongoose = require('mongoose');
const { isValidObjectId, isValid } = require("../validator/validation");

const createBlog = async function (req, res) {
    try {
        //<-------Checking Whether Request Body is empty or not----------->//
        let Blog = req.body

        if (!(Blog.title && Blog.body && Blog.authorId && Blog.category))
        return res.status(400).send({ status: false, msg: "Please fill the All Mandatory Fields." });

        // if (!Blog.title) return res.status(400).send({ status: false, msg: " title is required " })
        // if (!Blog.body) return res.status(400).send({ status: false, msg: "body is required " })
        // if (!Blog.authorId) return res.status(400).send({ status: false, msg: " authorId is required " })
        // if (!Blog.category) return res.status(400).send({ status: false, msg: " category is require" })

        //<-------Validation of Blog Body----------->// 
        if (!/^[A-Za-z _-]+$/.test(Blog.title)) {
            return res.status(400).send({ status: false, message: `title should contains only alphabets and - Charactor` })
        }  

        if (!/^[A-Za-z _-]+$/.test(Blog.body)) {
            return res.status(400).send({ status: false, message: `body should contains only alphabets and - Charactor` })
        }

            // let isValidObjectId = mongoose.Types.ObjectId.isValid(objectId);
        if (!isValidObjectId(Blog.authorId)) {
            return res.status(400).send({ status: false, msg: "Provide a valid author id" });
        }   // ---- Optional Validation 


        let blogCreated = await blogModel.create(Blog)

        res.status(201).send({ status: true, data: blogCreated })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


//<---------------This function used for Fetching a Blog--------------->//
const getBlogsData = async function (req, res) {
    try {
        let Query = req.query

        if (!Query.authorId) return res.status(400).send({ status: false, msg: "authorId is not avalible" })

        let isValid = mongoose.Types.ObjectId.isValid(Query.authorId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })

        if (!Query.category) return res.status(400).send({ status: false, msg: "category not avalible" })

        let blogsDetail = await blogModel.find({ AuthorId: Query.authorId, Category: Query.category, isDeleted: false }).populate("authorId") //ispublished =true not given because it not makes sense

        if (!blogsDetail) {
            return res.status(404).send({ status: false, msg: "Sorry , No data found" });
        }
        else return res.status(200).send({ status: true, status: true, data: blogsDetail })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



const updateBlog = async function (req, res) {
    try {     //Validate: The blogId is present in request path params or not.
        let BlogId = req.params.blogId
        let isValid = mongoose.Types.ObjectId.isValid(BlogId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid Blog objectID" })

        let { title, body, tags, subCategory } = req.body    //by Declaring and discturing mathod 
        if (!title) return res.send({status: false, msg: "title is required " })
        if (!body) return res.send({status: false, msg: "body is required " })
        if (!tags) return res.send({status: false, msg: "tags is required " })
        if (!subCategory) return res.send({status: false, msg: "subCategory is required " })

        let date = Date.now()

        let alert = await blogModel.findOne({ _id: BlogId, isDeleted: true })
        if (alert) return res.status(200).send({ status: false, msg: "Blog already deleted" })

        let updatedBlogs = await blogModel.findOneAndUpdate({ _id: BlogId },
            { $set: { title: title, body: body, isPublished: true, publishedAt: date }, $push: { tags: tags }, subCategory: subCategory }, { new: true })


        if (!updatedBlogs) return res.status(400).send({ status: false, msg: "no blog found" })
        else  res.status(200).send({ status: true, msg: updatedBlogs })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


const deleteBlog = async function (req, res) {
    try {
        let BlogId = req.params.blogId

        let isValid = mongoose.Types.ObjectId.isValid(BlogId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })
        let date = Date.now()

        let checkBlogId = await blogModel.findOne({ _id: BlogId, isDeleted: true })
        if (checkBlogId) return res.status(400).send({ status: false, msg: "Blog already deleted" })

        let deleteBlod = await blogModel.findOneAndUpdate({ _id: BlogId },
            { $set: { isDeleted: true, deletedAt: date } }, { new: true });

        return res.status(200).send({ status: true, status: true, msg: "Blog Has been Deleted Sucessfully" })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



const deleteBlogQuery = async function (req, res) {
    try {
        let Query = req.query;
        if (Object.keys(Query).length == 0) return res.status(400).send({ status: false, msg: "No input provided in Query" })

        if (Query.category = undefined) {
            return res.status(400).send({ status: false, msg: 'please provide category' })
        }

        if (Query.tags = undefined) {
            return res.status(400).send({ status: false, msg: 'please provide tags' })
        }
        if (Query.authorId = undefined) {
            return res.status(400).send({ status: false, msg: 'please provide authorId' })
        }

        // checking if blog already deleted or not
        const blogsDetail = await blogModel.find({ $and: [Query, { isDeleted: false }, { isPublished: true }] });
        if (blogsDetail.isDeleted == true || blogsDetail.length == 0)
            return res.status(200).send({ status: true, msg: "Document is already Deleted " })

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}



module.exports = { createBlog, getBlogsData, updateBlog, deleteBlog, deleteBlogQuery }