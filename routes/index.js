var express = require("express");
const axios = require("axios");
var app = express();
var router = express.Router();
const client = require('../config/connectDB')


client.connect();

// Create Blog

router.post("/createblog", async (req, res) => {

  try {

    const { title, description, image } = req.body;

    await client.query('BEGIN');

    const insertQuery = 'INSERT INTO blog (title, description, image) VALUES ($1, $2, $3) RETURNING *';
    const values = [title, description, image];
    const result = await client.query(insertQuery, values);

    await client.query('COMMIT');

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).send("500 Error Occured");
  }
});


//Update Blog

router.patch("/updateblog/:id", async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const blogId = req.params.id;

    const result = await client.query('SELECT * FROM blog WHERE id = $1', [blogId]);
    const blog = result.rows[0];

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const updateQuery = 'UPDATE blog SET title = $1, description = $2, image = $3 WHERE id = $4 RETURNING *';
    const updateValues = [title || blog.title, description || blog.description, image || blog.image, blogId];

    const updateResult = await client.query(updateQuery, updateValues);
    const updatedBlog = updateResult.rows[0];

    res.json({ message: "Blog updated successfully", blog: updatedBlog });


  } catch (error) {
    console.error(error);
    res.status(500).send("500 Error Occurred");
  }
});


// Delete Blog

router.delete("/deleteblog/:id", async (req, res) => {
  try {
    const blogId = req.params.id;

    const result = await client.query('SELECT * FROM blog WHERE id = $1', [blogId]);
    const blogToDelete = result.rows[0];

    if (!blogToDelete) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const deleteQuery = 'DELETE FROM blog WHERE id = $1 RETURNING *';
    const deleteValues = [blogId];

    const deleteResult = await client.query(deleteQuery, deleteValues);
    const deletedBlog = deleteResult.rows[0];

    res.json({ message: "Blog deleted successfully", blog: deletedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).send("500 Error Occurred");
  }
});


// Get All Blogs

router.get("/allblogs", async (req, res) => {
  try {

    const result = await client.query('SELECT * FROM blog');
    const allBlogs = result.rows;

    res.json({ blogs: allBlogs });

  } catch (error) {
    console.error(error);
    res.status(500).send("500 Error Occurred");
  }
});


// Get Single Blog

router.get("/blog/:id", async (req, res) => {
  try {
    const blogId = req.params.id;

    const result = await client.query('SELECT * FROM blog WHERE id = $1', [blogId]);
    const blog = result.rows[0];

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ blog });
  } catch (error) {
    console.error(error);
    res.status(500).send("500 Error Occurred");
  }
});


module.exports = router;
