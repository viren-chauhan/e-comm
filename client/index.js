const express = require("express");
const app = express();
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname,'./client/build')));
app.get('*',function(req,resp){
  resp.sendFile(path.join(__dirname,'./client/build/index.html'))
})

app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  resp.send(result);
});

app.post("/login", async (req, resp) => {
  let result;
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body);
    if (user) {
      resp.send(user);
    } else {
      resp.send({ result: "User Not Found!" });
    }
  } else {
    resp.send({ result: "Enter all Fields!" });
  }
  return resp.send(result);
});

app.post("/add-product", async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});

app.post("/products", async (req, resp) => {
  const products = await Product.find(req.body);
  if (products.length > 0) {
    resp.send(products);
  } else {
    resp.send({ result: "Product not Found!" });
  }
});

app.delete("/product/:id", async (req, resp) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.get("/update/:id", async (req, resp) => {
  const product = await Product.findOne({ _id: req.params.id });
  resp.send(product);
});

app.put("/update/:id", async (req, resp) => {
  const result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );

  resp.send(result);
});

app.post("/search/:key", async (req, resp) => {
  const item = Product.find(req.body);
  console.log(item);
  const result = await item.find({
    $or: [
      { name: { $regex: req.params.key } },
      //   { "company": { $regex: req.params.key } },
      // {"category" : {$regex : req.params.key}}
    ],
  });

  resp.send(result);
});

app.listen(5000);
