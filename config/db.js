const mongoose = require('mongoose');

const connectDB = async ()=> {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDb Connected: ${conn.connection.host}`);
  console.log(`MongoDb Connected: ${conn.connection.port}`);
}

module.exports = connectDB;
