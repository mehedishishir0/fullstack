require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

app.listen(process.env.PORT || 5000, async () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
  await connectDB();
});