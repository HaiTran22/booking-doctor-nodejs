import express from "express";


let configViewEngine = (app) => {
  // ảnh trên server chỉ được lấy từ mục public
  app.use(express.static("./src/public"));
  // set view engine có tên là ejs
  app.set("view engine", "ejs");
  // set đường link để lấy view engine
  app.set("views", "./src/views");
};

module.exports = configViewEngine;
