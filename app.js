const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const { ksrtcsmodel } = require("./models/ksrtc")
const jwt = require("jsonwebtoken")
const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://anjali2003:anjali2003@cluster0.wy6js.mongodb.net/ksrtcdb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}
app.post("/signUp", async (req, res) => {

    let input = req.body
    let hashedpassword = await generateHashedPassword(input.password)
    console.log(hashedpassword)
    input.password = hashedpassword
    let ksrtc = new ksrtcsmodel(input)
    ksrtc.save()
    res.json({ "status": "success" })
})

app.post("/signIn", (req, res) => {
    let input = req.body
    ksrtcsmodel.find({ "emailid": req.body.emailid }).then(
        (response) => {
            if (response.length > 0) {
                let dbPassword = response[0].password
                console.log(dbPassword)
                bcrypt.compare(input.password, dbPassword, (error, isMatch) => {
                    if (isMatch) {
                        jwt.sign({ email: input.emailid }, "ksrtc-app", { expiresIn: "1d" }, (error, token) => {
                            if (error) {
                                res.json({ "status": "unable to create token" })
                            } else {
                                res.json({ "status": "success", "userid": response[0]._id, "token": token })
                            }
                        })

                    } else {
                        res.json({ "status": "incorrect password" })
                    }
                })
            } else {
                res.json({ "status": "user doesn't exist" })
            }
        }
    ).catch()
})

app.post("/viewusers", (req, res) => {
    let token = req.headers["token"]
    jwt.verify(token, "ksrtc-app", (error, decoded) => {
        if (error) {
            res.json({ "status": "unauthorized access" })
        } else {
            if (decoded) {
                ksrtcsmodel.find().then(
                    (response) => {
                        res.json(response)
                    }
                ).catch()

            }
        }
    })
})

app.post("/AddBus", (req, res) => {
    let input = req.body
    console.log(input)
    let ksrtc = new ksrtcsmodels(input)
    ksrtc.save()
    res.json({ "status": "success" })
})

app.post("/search", (req, res) => {
    let input = req.body
    ksrtcsmodel.find(input).then(
        (data) => {
            res.json(data)
        }
    ).catch(
        (error) => {
            res.json(error)
        }
    )
})

app.post("/delete", (req, res) => {
    let input = req.body
    ksrtcsmodel.findByIdAndDelete(input._id).then(
        (response) => {
            console.log("DELETE")
            res.json({ "status": "success" })
        }
    ).catch(
        (error)=> {
        res.json({"status": "error"})
    }
)
})

app.get("/ViewAll", (req, res) => {
    ksrtcsmodel.find().then(
        (data) => {
            res.json(data)
        }
    ).catch((error) => {
        res.json(error)
    })
})

app.listen(8081, () => {
    console.log("server started")
})