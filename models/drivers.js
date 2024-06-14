const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
      "busname": { type: String, required: true },
            "route": { type: String, required: true },
            "busnumber": { type: String, required: true },
            "drivername": { type: String, required: true }  
    }
)
let driversmodel = mongoose.model("buses", schema);
module.exports = { driversmodel }