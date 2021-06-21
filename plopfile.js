module.exports = function(plop) {
    const today = new Date(Date.now())
    const shortDate = today.toISOString().split("T")[0]

    plop.setHelper("shortDate", () => shortDate),
      plop.setHelper("ISOStringDate", () => today.toISOString()),
      // optional welcome message
      plop.setWelcomeMessage(
        "Welcome to plop! What type of file would you like to generate?"
      ),
      plop.setGenerator("blog post ✏️", {
        description: "template for generating blog posts",
        prompts: [
          {
            type: "input",
            name: "title",
            message: "Title of post:",
          },
          {
            type: "input",
            name: "description",
            message: "Description of post:",
          },
          {
            type: "list",
            name: "category",
            message: "Category:",
            choices: ["Tutorial", "Reflection"],
            filter: function(val) {
              return val.toLowerCase()
            },
          },
        ],
        actions: [
          {
            type: "add",
            path: `_posts/${shortDate}-{{dashCase title}}.md`,
            templateFile: "_posts/blog-post.hbs",
          },
        ],
      })
  }