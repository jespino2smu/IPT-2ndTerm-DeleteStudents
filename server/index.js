// ========================

const express =require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const mongoose = require("mongoose");

const User = require("./model/user.model");

const port = 1337;

app.use(cors());
app.use(express.json());

mongoose
    .connect("mongodb://127.0.0.1:27017/SIS-db")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Connection error: ", err));

// app.get("/", (req, res) => {
//     res.send("Hello, world!");
// });

// =======================================================================

app.post("/add-user-db", async (req, res) => {
    const {name, email, password } = req.body;
    try {
        const newUser = User({name, email, password});
        await newUser.save();
        res.status(201).json({ message: "User added successfully!" })

    } catch (error) {
        console.error("Error adding user to database: ", error);
        res.status(500).json({ message: "Error adding user to database" });
    }
})

app.get("/users-db", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users from database: ", error);
        res.status(500).json({ message: "Error fetching users from database" });
    }
});

app.put("/edit-user-db/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully!", user: updatedUser });
    } catch (error) {
        console.error("Error updating user in database: ", error);
        res.status(500).json({ message: "Error updating user in database" });
    }
});

app.delete("/delete-user-db/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        console.error("Error deleting user from database: ", error);
        res.status(500).json({ message: "Error deleting user from database" });
    }
});
// =======================================================================
const multer = require('multer');
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath); 
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
// =======================================================================


// ===================================================
// app.use("/uploads", express.static("uploads"));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   }
// });

// File filter (images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// const upload = multer({ storage, fileFilter });

app.post("/api/form", upload.single("image"), (req, res) => {
  const { id, name, category } = req.body;
  const image = req.file;

  res.json({
    message: "Form received",
    data: {
      id,
      name,
      category,
      image: image?.filename
    }
  });
});
// ===================================================

// add student
app.post("/add-student", upload.single('image'), (req, res) => {
    try {
        const newStudent = req.body;

        console.log(newStudent);
        if (req.file) {
            newStudent.image = `http://localhost:${port}/uploads/${req.file.filename}`;
        } else {
            newStudent.image = null;
        }

        fs.readFile("students.json", "utf8", (err, data) => {
            if (err) return res.status(500).send("Error reading file");
            
            const students = JSON.parse(data || "[]");
            const existing = students.find(s => s.idNumber === newStudent.idNumber);
            if (existing) return res.status(400).send("Student ID already exists");

            students.push(newStudent);
            fs.writeFile("students.json", JSON.stringify(students, null, 2), (err) => {
                if (err) return res.status(500).send("Error writing file");
                res.send("Student added successfully!");
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Invalid data format");
    }
});

// ========================


// ========================
// add user
app.post("/add-user", (req, res) => {
    const newUser = req.body;
    fs.readFile("data.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file");
        }

        const users = JSON.parse(data);
        users.push(newUser);
        fs.writeFile("data.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Error writing file");
            }
            res.send("User added successfully!");
        });
    });
});

// view users
app.get("/users", (req, res) => {
    fs.readFile("data.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file");
        }

        const users = JSON.parse(data);
        res.json(users);
    });
});

// edit user
app.put("/edit-user/:index", (req, res) => {
    const index = req.params.index;
    const updatedUser = req.body;

    fs.readFile("data.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file");
        }

        const users = JSON.parse(data);

        if (users[index] === undefined) {
            return res.status(404).send("User not found");
        }

        users[index] = updatedUser;

        fs.writeFile("data.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Error writing file");
            }

            res.send("User updated successfully!");
        });
    });
});

// delete user
app.delete("/delete-user/:index", (req, res) => {
    const index = req.params.index;
    const updatedUser = req.body;

    fs.readFile("data.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file");
        }

        const users = JSON.parse(data);

        if (users[index] === undefined) {
            return res.status(404).send("User not found");
        }

        users.splice(index, 1);
        // users[index] = updatedUser;

        fs.writeFile("data.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Error writing file");
            }

            res.send("User updated successfully!");
        });
    });
});

// edit student
app.put("/edit-student/:index", upload.single('profileImage'), (req, res) => {
    const index = req.params.index;
    const updatedStudent = req.body;

    fs.readFile("students.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file");
        }

        const students = JSON.parse(data);

        if (students[index] === undefined) {
            return res.status(404).send("Student not found");
        }
        
        if (req.file) {
            updatedStudent.image = `http://localhost:${port}/uploads/${req.file.filename}`;
        }

        students[index] = updatedStudent;

        fs.writeFile("students.json", JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Error writing file");
            }

            res.send("Student updated successfully!");
        });
    });
});

// delete student
app.delete("/delete-student/:index", (req, res) => {
    const index = req.params.index;

    fs.readFile("students.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file");
        }

        const students = JSON.parse(data);

        if (students[index] === undefined) {
            return res.status(404).send("Student not found");
        }

        const defaultProfileImage = "http://localhost:1337/uploads/profile_default.png";
        if (students[index].image && students[index].image !== defaultProfileImage) {
            // Extract the filename from URL
            const filename = students[index].image.split('/').pop();
            const filePath = path.join(__dirname, 'uploads', filename);

            // Delete the file from uploads
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Failed to delete local file:", err);
                } else {
                    console.log(`Successfully deleted image: ${filename}`);
                }
            });
        }

        students.splice(index, 1);

        fs.writeFile("students.json", JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Error writing file");
            }

            res.send("Student deleted successfully!");
        });
    });
});

// ========================

// view students
app.get("/students", (req, res) => {
    fs.readFile("students.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file");
        }

        const users = JSON.parse(data);
        res.json(users);
    });
});

// ========================

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

// ========================

app.get('/user/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Welcome, ${name}!`);
});

app.get('/calculate/:num1/:num2', (req, res) => {
    const num1 = parseInt(req.params.num1);
    const num2 = parseInt(req.params.num2);
    const sum = num1 + num2;
    res.send(`The sum of ${num1} and ${num2} is ${sum}`);
});


app.get('/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.send('Please provide a search query using ?q=your_query');
    }
    res.send(`You searched for: ${query}`);
});