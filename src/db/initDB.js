const mongoose = require('mongoose');

const initDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB, {
        useCreateIndex:true,
        useFindAndModify:true,
        useNewUrlParser:true,
        useUnifiedTopology:true
        }, () => {
            console.log("Sucessfully Connected to mongoDB")
        })
    } catch (error) {
        console.log("error connecting mongodb")
    }
    
}

initDB();