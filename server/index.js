const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");

dbConnect();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});








// app.get("/test/info", (req, res) => {
//   res.json(models.schemaInfo());
// });

// app.get("/user/list", (req, res) => {
//   res.json(models.userListModel());
// });

// app.get("/user/:id", (req, res) => {
//   const user = models.userModel(req.params.id);
//   if (!user) {
//     return res.status(404).json({ error: "User not found" });
//   }
//   return res.json(user);
// });

// app.get("/photosOfUser/:id", (req, res) => {
//   const photos = models.photoOfUserModel(req.params.id);
//   return res.json(photos);
// });

// app.listen(PORT, () => {
//   console.log(`Photo sharing API server listening at http://localhost:${PORT}`);
// });



