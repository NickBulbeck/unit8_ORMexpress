const express = require('express');
const router = express.Router();
const Article = require('../models').Article;   // this is set up in models/index using the
                                                // fs trickery in there.

/* Handler function to wrap each route. */
// You'll remember this from the unit8/ course material: it saves writing the same
// boilerplate try-catch code for every route.
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      res.status(500).send(error);
    }
  }
}

/* GET articles listing. */
router.get('/', asyncHandler(async (req, res) => {
  const narticles = await Article.findAll({order: [["createdAt","DESC"]]});
  res.render("articles/index", {  articles: narticles , title: "Sequelize-It!" });
}));

/* Create a new article form. */
router.get('/new', (req, res) => {
  res.render("articles/new", { article: {}, title: "New Article" });
});

/* POST create article. */
router.post('/', asyncHandler(async (req, res) => {
  // console.log(req.body); // this comes via bodyParser from the form posted and shows
  //                        // you an Article object
  const article = await Article.create(req.body);// you could build this longhand using
                                                // req.body.title, .author. , .body
  res.redirect("/articles/" + article.id); // Sequelize auto-generates an id, remember
}));

/* Edit article form. */
router.get("/:id/edit", asyncHandler(async(req, res) => {
  const article = await Article.findByPk(req.params.id);
  // remember: instead of `article: article,` below, we can just pass `article,`
  res.render("articles/edit", { article: article, title: "Edit Article" });
}));

/* GET individual article. */
router.get("/:id", asyncHandler(async (req, res) => {
  const article = await Article.findByPk(req.params.id);
  res.render("articles/show", { article: article, title: article.title }); 
}));

/* Update an article. */
router.post('/:id/edit', asyncHandler(async (req, res) => {
  const article = await Article.findByPk(req.params.id);
  await article.update(req.body);
  res.redirect("/articles/" + article.id);
}));

/* Delete article form. */
router.get("/:id/delete", asyncHandler(async (req, res) => {
  const article = await Article.findByPk(req.params.id);
  res.render("articles/delete", { article: article, title: "Delete Article" });
}));

/* Delete individual article. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const article = await Article.findByPk(req.params.id);
  await article.destroy();
  res.redirect("/articles");
}));

module.exports = router;