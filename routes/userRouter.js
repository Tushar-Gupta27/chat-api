import express from "express";
import Users from "../models/userModel.js";
import bcrypt from "bcryptjs";
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      password !== ""
    ) {
      const hashedpassword = await bcrypt.hash(password, 12);
      const result = await Users.create({
        firstName,
        lastName,
        email,
        password: hashedpassword,
      });
      return res.status(201).json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await Users.findOne({ email: email });
    if (foundUser) {
      const isPassCorrect = await bcrypt.compare(password, foundUser.password);
      if (!isPassCorrect) {
        return res.status(400).json({ message: "Invalid Creds" });
      } else {
        return res.status(200).json(foundUser);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  const { userId, username } = req.query;
  if (userId || username) {
    let resUsers;
    if (username && userId) {
      const usernameArr = username.split(" ") || [];
      resUsers = await Users.find({
        $or: [
          { _id: userId },
          { firstName: usernameArr[0] },
          { lastName: usernameArr[1] },
        ],
      });
    } else {
      resUsers = userId
        ? await Users.find({ _id: userId })
        : await Users.find({
            $or: [
              { firstName: username.split(" ")[0] },
              { lastName: username.split(" ")[1] },
            ],
          });
    }
    return res.status(200).json(resUsers);
  } else {
    try {
      const resUsers = await Users.find();
      res.status(200).json(resUsers);
    } catch (error) {
      console.log(err);
    }
  }
});

export default router;
