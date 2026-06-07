const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const path = require("path");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");

dbConnect();
const PORT = process.env.PORT || 8080;

require("dotenv").config();
jwt_secret = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// app.use("/api/user", UserRouter);
// app.use("/api/photo", PhotoRouter);

const User = require("./db/userModel");
const Photo = require("./db/photoModel");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  jwt.verify(token, jwt_secret, (err, decodeUser) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
    req.user = decodeUser;
    next();
  });
}


app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.get("/api/user/list", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}).select("first_name last_name");
    res.status(200).json(users);
  }
  catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

app.get("/api/user/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  }
  catch (error) {
    console.error("Lỗi khi GET 1 người dùng:", error);
    res.status(400).json({ message: "Invalid User ID format" });
  }
});

app.get("/api/photosOfUser/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const photos = await Photo.find({ user_id: id })
      .populate('user_id', 'first_name last_name')
      .populate({ path: 'comments.user_id', select: 'first_name last_name', model: 'Users' })
      .lean();

    if (!photos || photos.length === 0) {
      return res.status(404).json({ message: "No photos found for this user" });
    }
    res.status(200).json(photos);
  }
  catch (error) {
    console.error("Lỗi khi tìm ảnh của user:", error);
    res.status(400).json({ message: "Invalid User ID format" });
  }
});

app.post("/api/commentsOfPhoto/:photoId", verifyToken, async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const { comment } = req.body;
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Bình luận không được để trống!" });
    }

    const photo = await Photo.findOne({ _id: photoId });
    if (!photo) {
      return res.status(404).json({ message: "Không tìm thấy bài viết!" });
    }

    const newComment = {
      comment: comment,
      user_id: req.user.id,
      date_time: new Date()
    };

    photo.comments.push(newComment);
    await photo.save();
    res.status(200).json({ message: "Đã thêm bình luận!", photo: photo });
  }
  catch (err) {
    console.error("Lỗi khi thêm bình luận:", err);
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
})


app.post("/api/user", async (req, res) => {
  try {
    const { first_name, last_name, location, description, occupation, login_name, password } = req.body;

    if (!first_name || !last_name || !login_name || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' })
    }

    const existingUser = await User.findOne({ login_name: login_name });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
    }

    const newUser = new User({
      first_name,
      last_name,
      location,
      description,
      occupation,
      login_name,
      password,
    })
    await newUser.save();

    res.status(200).json({ message: "Đăng ký thành công!", login_name: newUser.login_name });
  }
  catch (err) {
    console.error("Lỗi khi đăng ký:", err);
    res.status(400).json({ message: "Lỗi đăng ký!", error: err.message });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { login_name, password } = req.body;
    const user = await User.findOne({ login_name: login_name, password: password });
    if (user) {
      const token = jwt.sign(
        { id: user._id, login_name: user.login_name, first_name: user.first_name },
        jwt_secret,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Đăng nhập thành công!", token: token, user: { _id: user._id, first_name: user.first_name, last_name: user.last_name, login_name: user.login_name } });
    }
    else {
      res.status(400).json("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  }
  catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

app.post("/api/admin/logout", (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công!" });
})

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



