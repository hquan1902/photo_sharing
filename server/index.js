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

const User = require("./db/userModel");
const Photo = require("./db/photoModel");


app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.get("/api/user/list", async (req, res) => {
  try{
    const users = await User.find({}).select("first_name last_name");
    res.status(200).json(users);
  }
  catch(error){
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({message: "Server error!"});
  }
});

app.get("/api/user/:id", async (req, res) => {
  try{
    const id = req.params.id;
    const user = await User.findOne({_id: id});
    if(!user){
      return res.status(400).json({message: "User not found!"});
    }
    res.status(200).json(user);
  }
  catch(error){
    console.error("Lỗi khi GET 1 người dùng:", error);
    res.status(400).json({message: "Invalid User ID format"});
  }
});

app.get("/api/photosOfUser/:id", async (req, res) => {
  try{
    const id = req.params.id;
    const photos = await Photo.find({user_id: id}).lean();
    if(!photos || photos.length === 0){
      return res.status(400).json({message: "No photos found for this user"});
    }
    res.status(200).json(photos);
  }
  catch(error){
    console.error("Lỗi khi tìm ảnh của user:", error);
    res.status(400).json({message: "Invalid User ID format"});
  }
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



