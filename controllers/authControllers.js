const Users = require("../model/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const user = new Users({
            username,
            email,
            password: hashpassword,
            image,
            role,
        });

        await user.save();

        const saved={
            username:user.username,
            email:user.email,
            role:user.role,
        }
       
        res.status(201).json({
            message: "Signup successful", saved
        });
    } catch (error) {
        console.log("Error during signup:", error);
        res.status(500).json({ message: "Error in signing up" });
    }
};


const Login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const checkuser = await Users.findOne({ email });

        if (!checkuser) {
            return res.status(400).json({ message: "Email does not exist" });
        }

        const checkpassword = await bcrypt.compare(password, checkuser.password);
        

        if (!checkpassword) {

            return res.status(400).json({ message: "Password is incorrect" });
        }

        const token = jwt.sign({ id: checkuser.id, username: checkuser.username, role: checkuser.role }, "secretkey123", { expiresIn: "1d" })

        res.status(200).json({ message: "logged succesfully", token: token, email: checkuser.email })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in signing up" });
    }
}

module.exports = { Signup, Login };