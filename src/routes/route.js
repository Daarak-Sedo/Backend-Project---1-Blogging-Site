const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const { authenticate, authorize } = require("../middlewares/auth")



//<-------------This API used for Create Author---------------->//
router.post("/authors", authorController.createAuthor)


//<--------------This API used for Log in Author------------------>//
router.post("/Blogs", authenticate, blogController.createBlog)


//<--------------------This API used for Create Blogs-------------->//
router.get("/getBlogs", authenticate,blogController.getBlogsData)


//<----------------This API used for Fetch Blogs of Logged in Author----------->//
router.put("/blogs/:blogId", authorize, blogController.updateBlog)


//<----------------This API used for Update Blogs of Logged in Author---------->//
router.delete("/blogs/:blogId", authorize, blogController.deleteBlog)


//<----------------These APIs used for Deleting Blogs of Logged in Author--------->//
router.delete("/blogs", authenticate, blogController.deleteBlogQuery)


//<-------This API is used for handling any invalid Endpoints--------->//
router.post("/login", authorController.login)


//API for wrong route-Of-API
router.all("/*", function (req, res) {
    res.status(404).send({
        status: false,
        message: "The api you request is not available"
    })
})



module.exports = router;













