const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        "name": { type: String, required: true },
        "emailid": { type: String, required: true },
        "password": { type: String, required: true },
        "busname": { type: String, required: true },
            "route": { type: String, required: true },
            "busnumber": { type: String, required: true },
            "drivername": { type: String, required: true }
    }
)
let ksrtcsmodel = mongoose.model("users", schema);
module.exports = { ksrtcsmodel }