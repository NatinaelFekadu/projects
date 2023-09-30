import Post from "../models/posts.js";

const createPost = async (req, res, next) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    // console.log(post);
    const createdPost = await post.save();
    res.status(201).json({
      message: "Post added successfully!",
      post: {
        ...createdPost,
        id: createdPost._id,
      },
    });
  } catch (error) {}
};

const getPosts = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  try {
    let posts = Post.find();
    let totalPosts = await Post.count();
    if (pageSize && currentPage) {
      posts = await posts.skip(pageSize * (currentPage - 1)).limit(pageSize);
    } else {
      posts = await Post.find();
    }

    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: posts,
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Couldn't fetch posts!",
    });
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Post not found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Couldn't fetch a post!",
    });
  }
};

const editPost = async (req, res, next) => {
  try {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    const result = await Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    );
    if (result.matchedCount > 0) {
      res.status(201).json({
        result: result,
      });
    } else {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Couldn't update a post!",
    });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const result = await Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId,
    });
    if (result.deletedCount > 0) {
      res.status(201).json({
        result: result,
      });
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Couldn't delete a post!",
    });
  }
};

export const postsController = {
  createPost,
  getPosts,
  getPost,
  editPost,
  deletePost,
};
