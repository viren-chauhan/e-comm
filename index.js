const express = require("express");
const app = express();
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, resp) {
  resp.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.post("/register", async (req, resp) => {
  try {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    resp.send(result);
  } catch (error) {
    resp.status(error.response.status);
    return resp.send(error.message);
  }
});

app.post("/login", async (req, resp) => {
  try {
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
  } catch (error) {
    resp.status(error.response.status);
    return resp.send(error.message);
  }
});

app.post("/add-product", async (req, resp) => {
  try {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
  } catch (error) {
    resp.status(error.response.status);
    return resp.send(error.message);
  }
});

app.post("/products", async (req, resp) => {
  try {
    const products = await Product.find(req.body);
    if (products.length > 0) {
      resp.send(products);
    } else {
      resp.send({ result: "Product not Found!" });
    }
  } catch (error) {
    resp.status(error.response.status);
    return resp.send(error.message);
  }
});

app.delete("/product/:id", async (req, resp) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result);
  } catch (error) {
    resp.status(error.response.status);
    return resp.send(error.message);
  }
});

app.get("/update/:id", async (req, resp) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    resp.send(product);
  } catch (error) {
    resp.status(error.response.status);
    return resp.send(error.message);
  }
});

app.put("/update/:id", async (req, resp) => {
  try {
    const result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    resp.send(result);
  } catch (error) {
    resp.status(error.response.status);
    return resp.send(error.message);
  }
});

app.post("/search/:key", async (req, resp) => {
  try {
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
  } catch (error) {
    resp.status(error.response.status);
    return resp.send(error.message);
  }
});

app.listen(5000);
