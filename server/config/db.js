// ============================================
// MongoDB Connection Module
// ============================================
// WHY A SEPARATE FILE: Database connection logic is separated from
// server.js for clean architecture. This follows the "Single
// Responsibility Principle" — server.js handles Express setup,
// this file handles database connection.
//
// HOW IT WORKS:
//   1. Import mongoose (our ODM — Object Data Modeling library)
//   2. Export an async function that connects to MongoDB
//   3. server.js calls this function before starting the server
//   4. If connection fails, the app exits (no point running without a DB)
// ============================================

const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the URI from environment variables.
 *
 * This function is called once during server startup (in server.js).
 * It uses async/await because connecting to a database is an
 * asynchronous operation — it involves network communication
 * that takes time to complete.
 *
 * @returns {Promise<void>}
 * @throws {Error} If connection fails — caught by the try/catch in this function
 */
const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise that resolves to a
    // "connection" object when the connection is established.
    //
    // The MONGO_URI comes from .env:
    //   Local:  mongodb://localhost:27017/jobcaliber
    //   Atlas:  mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/jobcaliber
    //
    // Mongoose 6+ removed the need for most connection options
    // (useNewUrlParser, useUnifiedTopology, etc.) — they're now defaults.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log the host to confirm which database we connected to.
    // conn.connection.host shows the hostname (e.g., "localhost" or "cluster0.abc123.mongodb.net")
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails (wrong URI, MongoDB not running, network issue),
    // log the error and EXIT the process.
    //
    // WHY EXIT: A server without a database cannot serve any useful request.
    // It's better to crash loudly during startup than to silently accept
    // requests and return errors for everything.
    //
    // process.exit(1) terminates the Node.js process with exit code 1
    // (convention: 0 = success, 1 = failure). In production, a process
    // manager (like PM2) would automatically restart it.
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
