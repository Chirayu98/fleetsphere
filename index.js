require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const User = require("./models/User");
const Message = require("./models/Message");
const Connection = require("./models/Connection");
const postRoutes = require("./routes/postRoutes");
const jobRoutes = require("./routes/jobRoutes");
const Follower = require("./models/Follower");
const Applicant = require("./models/Applicant");
const Job = require("./models/Job");
const Post = require("./models/Post");

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:5501',
  'http://localhost:5501'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// ✅ Serve static files (like chat.html) from /public
app.use(express.static(path.join(__dirname, "public")));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {

})

.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/posts', postRoutes);
app.use('/jobs', jobRoutes);

// ✅ Signup
app.post("/signup", async (req, res) => {
  const { name, email, password, role, vehicle } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "User already exists" });

    const newUser = new User({ name, email, password, role, vehicle });
    await newUser.save();

    res.json({
      success: true,
      message: "Signup successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        vehicle: newUser.vehicle,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        vehicle: user.vehicle,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ✅ Get user profile
app.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Update user profile
app.put("/profile/:id", async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Profile updated", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
});


// ✅ Extra Routes
app.get("/companies/:id", async (req, res) => {
  try {
    const company = await User.findById(req.params.id);
    if (!company || company.role !== 'company') {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    res.json({ success: true, company });
  } catch (err) {
    console.error("Get company error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/followers/:id", async (req, res) => {
  try {
    const followers = await Follower.find({ companyId: req.params.id });
    res.json({ success: true, followers });
  } catch (err) {
    console.error("Get followers error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/applicants/:id", async (req, res) => {
  try {
    const applicants = await Applicant.find({ companyId: req.params.id });
    res.json({ success: true, applicants });
  } catch (err) {
    console.error("Get applicants error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.patch("/applicants/status/:id", async (req, res) => {
  try {
    await Applicant.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/jobs/company/:id", async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.params.id });
    res.json({ success: true, jobs });
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/applicants", async (req, res) => {
  try {
    const { jobId, userId, name, email, jobTitle } = req.body;
    const existing = await Applicant.findOne({ jobId, userId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already applied" });
    }

    const newApplicant = new Applicant({
      jobId,
      userId,
      name,
      email,
      jobTitle,
      status: "Pending"
    });

    await newApplicant.save();
    res.json({ success: true, message: "Application submitted", applicant: newApplicant });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ success: false, message: "Failed to apply" });
  }
});



// ✅ User APIs
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/posts/user/:id", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id });
    res.json({ success: true, posts });
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/connections", async (req, res) => {
  const { followerId, followingId } = req.body;
  try {
    const existing = await Connection.findOne({ followerId, followingId });
    if (existing) return res.status(400).json({ success: false, message: "Already connected" });

    const connection = new Connection({ followerId, followingId });
    await connection.save();
    res.json({ success: true, connection });
  } catch (err) {
    console.error("Connect error:", err);
    res.status(500).json({ success: false, message: "Failed to connect" });
  }
});

app.get("/connections/:userId", async (req, res) => {
  try {
    const connections = await Connection.find({ followerId: req.params.userId });
    res.json({ success: true, connections });
  } catch (err) {
    console.error("Get connections error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/chat-users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ success: false });

  let users = [];

  if (user.role === 'delivery') {
    // ✅ 1. Get companyIds via Jobs
    const applied = await Applicant.find({ userId });
    const jobIds = applied.map(a => a.jobId);
    const jobs = await Job.find({ _id: { $in: jobIds } });
    const companyIds = [...new Set(jobs.map(j => j.companyId.toString()))];
    const companies = await User.find({ _id: { $in: companyIds }, role: 'company' });

    // ✅ 2. Get delivery friends
    const connections = await Connection.find({ followerId: userId });
    const deliveryIds = connections.map(c => c.followingId);
    const friends = await User.find({ _id: { $in: deliveryIds }, role: 'delivery' });

    users = [...companies, ...friends];

  } else if (user.role === 'company') {
    // ✅ For company: get applicants
    const applicants = await Applicant.find({ companyId: userId });
    const userIds = [...new Set(applicants.map(a => a.userId))];
    users = await User.find({ _id: { $in: userIds }, role: 'delivery' });
  }

  res.json({ success: true, users });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Fleetsphere backend running at http://localhost:${PORT}`);

});
