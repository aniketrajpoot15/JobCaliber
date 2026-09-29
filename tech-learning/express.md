<!-- 📌 WHAT IS THIS FILE? This is the learning guide for Express.js and its middleware ecosystem, written for a student building JobCaliber. It covers Express from the ground up, what middleware is, how request/response works, and explains environment variables, dotenv, and how the server entry point is structured. Every concept is tied back to JobCaliber's actual code. -->

# Express.js

> **Status:** ✅ `ACTIVE` — introduced in Step 2.4, middleware configured in Step 2.5  
> **Category:** Backend Web Framework  
> **Used in:** `server/server.js`, all routes, controllers, and middleware in `server/`

---

## 1. What Is It?

**Express.js** is a minimal, unopinionated **web framework for Node.js**. It gives you a structured way to:

1. **Listen** for incoming HTTP requests (GET, POST, PUT, DELETE, etc.)
2. **Route** each request to the right handler based on the URL path and HTTP method
3. **Process** the request through a chain of **middleware** functions
4. **Send** back an HTTP response (JSON data, HTML, error messages, etc.)

Think of Express as a **traffic controller** sitting between the raw internet (HTTP) and your application logic:

```
                    INTERNET
                       │
                       ▼
             ┌──────────────────┐
             │    EXPRESS.JS     │
             │                  │
             │  1. Receive HTTP  │
             │     request       │
             │                  │
             │  2. Run through   │
             │     middleware     │
             │     chain         │
             │                  │
             │  3. Match to a    │
             │     route handler │
             │                  │
             │  4. Send back     │
             │     HTTP response │
             └──────────────────┘
                       │
                       ▼
           YOUR CODE (controllers)
                       │
                       ▼
             MongoDB (via Mongoose)
```

### Without Express vs. With Express

Node.js CAN handle HTTP requests on its own using the built-in `http` module, but it's extremely verbose:

```javascript
// ❌ Without Express — raw Node.js HTTP server
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/applications') {
    // manually parse URL, headers, body, cookies...
    // manually set Content-Type header...
    // manually serialize JSON...
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: [] }));
  } else if (req.method === 'POST' && req.url === '/api/applications') {
    // collect body chunks manually...
    // parse JSON manually...
    // etc.
  }
  // No middleware, no routing, no error handling built in
});

server.listen(5000);
```

```javascript
// ✅ With Express — clean, readable, extensible
const express = require('express');
const app = express();

app.use(express.json()); // middleware: auto-parse JSON bodies

app.get('/api/applications', (req, res) => {
  res.json({ data: [] }); // automatic Content-Type, serialization
});

app.post('/api/applications', (req, res) => {
  const body = req.body; // already parsed by middleware
  // ...
});

app.listen(5000);
```

Express eliminates boilerplate and lets you focus on your **application logic**.

---

## 2. Why Are We Using It?

| Reason | Explanation |
|---|---|
| **Industry Standard** | Express is by far the most popular Node.js web framework (~30 million weekly npm downloads). If you learn Express, you can work on most Node.js backends. |
| **Minimal & Flexible** | Express provides the essentials (routing, middleware, request/response) without forcing a rigid structure. We decide how to organize our files. |
| **Middleware Ecosystem** | Express's middleware model lets us plug in security (helmet), rate limiting (express-rate-limit), input sanitization (express-mongo-sanitize), etc. with one line each. |
| **MERN Compatibility** | Express is the "E" in MERN. It naturally pairs with MongoDB/Mongoose on the data side and React on the frontend side. |
| **Learning Value** | Express is one of the most valuable technologies for SWE internship interviews. Understanding it deeply makes you a stronger full-stack candidate. |

---

## 3. Where Is It Used in Our Project?

| File/Directory | How Express Is Used |
|---|---|
| `server/server.js` | Creates the Express app, registers middleware, starts listening |
| `server/routes/` | Defines URL endpoints and maps them to controller functions |
| `server/controllers/` | The actual handler logic that runs when a route is matched |
| `server/middleware/` | Custom middleware (auth verification, error handling, validation) |

---

## 4. Prerequisites

Before writing Express code, you should understand:
- **Node.js Basics:** How `require()` works, `process.env`, running `node file.js`
- **HTTP Fundamentals:** What GET/POST/PUT/DELETE mean, what status codes are (200, 400, 401, 404, 500)
- **JavaScript:** `async/await`, arrow functions, destructuring, template literals
- **REST API Concepts:** URL structure, request/response cycle (see `tech-learning/rest-api.md`)

---

## 5. Core Concepts

### 5.1 The Express Application Object

Everything in Express revolves around the **`app` object**:

```javascript
const express = require('express');
const app = express(); // ← this is the app object
```

The `app` object is the central hub. You register everything on it:
- `app.use(middleware)` — register middleware
- `app.get(path, handler)` — register a GET route
- `app.post(path, handler)` — register a POST route
- `app.listen(port, callback)` — start the server

### 5.2 The Request-Response Cycle

Every HTTP interaction follows this cycle:

```
CLIENT (browser/Postman)           SERVER (Express)
         │                              │
         │── HTTP Request ─────────────►│
         │   (method, URL, headers,     │
         │    body, cookies)            │
         │                              │
         │                    ┌─────────┤
         │                    │ Middleware 1 (e.g., parse JSON)
         │                    │ Middleware 2 (e.g., check auth)
         │                    │ Middleware 3 (e.g., sanitize input)
         │                    │ Route Handler (your logic)
         │                    └─────────┤
         │                              │
         │◄── HTTP Response ────────────│
         │   (status code, headers,     │
         │    JSON body)                │
```

Express gives you two objects to work with in every handler:

| Object | What It Is | What It Contains |
|---|---|---|
| `req` (Request) | The incoming HTTP request | `req.body` (parsed JSON), `req.params` (URL params like `:id`), `req.query` (query strings like `?status=Applied`), `req.cookies`, `req.headers` |
| `res` (Response) | The outgoing HTTP response | `res.json(data)` (send JSON), `res.status(404)` (set status code), `res.cookie(name, value)` (set a cookie), `res.send(text)` |

```javascript
// Example: a route handler receives req, sends res
app.get('/api/applications/:id', (req, res) => {
  const applicationId = req.params.id;  // from the URL
  const userId = req.user._id;          // from auth middleware (added to req)
  
  // ... find in database ...
  
  res.status(200).json({                // send response
    success: true,
    data: application
  });
});
```

### 5.3 Middleware — The Core Pattern

**Middleware** is the most important concept in Express. A middleware is a function that:
1. Receives `req`, `res`, and `next`
2. Does something (parse body, check auth, log request, etc.)
3. Either **sends a response** (ending the cycle) OR calls **`next()`** to pass control to the next middleware

```javascript
// Middleware function signature:
function myMiddleware(req, res, next) {
  // do something with req or res
  
  // Option A: pass to next middleware
  next();
  
  // Option B: end the cycle by sending a response
  // res.status(401).json({ message: 'Not authorized' });
}
```

**Middleware executes in ORDER — like a conveyor belt:**

```
Request arrives
     │
     ▼
┌─────────────────────┐
│  express.json()      │  ← Parse JSON body
│  (built-in)         │
└──────────┬──────────┘
           │ next()
           ▼
┌─────────────────────┐
│  cors()              │  ← Set CORS headers
│  (third-party)      │
└──────────┬──────────┘
           │ next()
           ▼
┌─────────────────────┐
│  cookieParser()      │  ← Parse cookies
│  (third-party)      │
└──────────┬──────────┘
           │ next()
           ▼
┌─────────────────────┐
│  helmet()            │  ← Set security headers
│  (third-party)      │
└──────────┬──────────┘
           │ next()
           ▼
┌─────────────────────┐
│  Your Route Handler  │  ← Your app logic
│  app.get('/...')     │
└──────────┬──────────┘
           │ res.json()
           ▼
     Response sent
```

**ORDER MATTERS.** If `express.json()` isn't registered before your route, `req.body` will be `undefined`.

### 5.4 Routes and Route Parameters

Routes define WHICH function handles WHICH URL + HTTP method:

```javascript
// Basic routes
app.get('/api/applications', listApplications);       // GET all
app.post('/api/applications', createApplication);     // CREATE one
app.get('/api/applications/:id', getApplication);     // GET one by ID
app.put('/api/applications/:id', updateApplication);  // UPDATE one
app.delete('/api/applications/:id', deleteApplication); // DELETE one
```

The `:id` is a **route parameter** — Express extracts it into `req.params.id`:
```
URL: /api/applications/abc123
req.params.id → "abc123"
```

### 5.5 app.listen()

```javascript
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

This does two things:
1. **Binds** the Express app to a TCP port on your machine (e.g., port 5000)
2. **Starts accepting** incoming HTTP connections

The callback function fires once the server is ready. It's just for logging — the server works without it.

---

## 6. Environment Variables & dotenv

### 6.1 What Are Environment Variables?

**Environment variables** are key-value pairs that exist **outside your code**, in the operating system's environment. They store configuration that changes between environments (your laptop, a test server, a production server) without changing any code.

```
Think of them like settings on a machine:

YOUR LAPTOP (development):        PRODUCTION SERVER:
  PORT=5000                          PORT=80
  NODE_ENV=development               NODE_ENV=production
  MONGO_URI=localhost:27017          MONGO_URI=atlas-cluster.mongodb.net
  JWT_SECRET=abc123...               JWT_SECRET=xyz789...
```

**Why not just hardcode values?**

| Approach | Problem |
|---|---|
| `const port = 5000;` | Can't change without editing code. Different for every machine. |
| `const secret = "mypassword123";` | **SECURITY DISASTER.** Anyone who reads your code (or your Git repo) sees your secret. |
| `const dbUrl = "mongodb://localhost:27017";` | Breaks in production where the database URL is different. |

Environment variables solve all three problems:
```javascript
const port = process.env.PORT;       // reads from the OS environment
const secret = process.env.JWT_SECRET; // never in source code
const dbUrl = process.env.MONGO_URI;   // different per machine
```

### 6.2 How process.env Works in Node.js

Node.js gives you `process.env` — an object containing all environment variables available to the running process.

```javascript
// These are always available (set by the OS):
process.env.PATH     // system PATH
process.env.HOME     // home directory
process.env.USER     // current user

// These are custom (we set them ourselves):
process.env.PORT         // "5000"
process.env.JWT_SECRET   // "713b72a549ac..."
process.env.MONGO_URI    // "mongodb://localhost:27017/jobcaliber"
```

**Important:** `process.env` values are ALWAYS **strings**. Even if you write `PORT=5000` in your `.env` file, `process.env.PORT` returns the string `"5000"`, not the number `5000`. Express's `app.listen()` handles this conversion automatically, but if you need a number elsewhere, you'd use `parseInt(process.env.PORT, 10)`.

### 6.3 The .env File

Setting environment variables through the OS command line is tedious:
```bash
# Windows PowerShell:
$env:PORT = "5000"
$env:MONGO_URI = "mongodb://localhost:27017/jobcaliber"
$env:JWT_SECRET = "713b72a549ac..."
# You'd have to do this EVERY time you open a terminal!
```

The `.env` file solves this. It's a simple text file in your project:

```ini
# server/.env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobcaliber
JWT_SECRET=713b72a549ac9568c36f...
JWT_EXPIRE=7d
COOKIE_SECRET=fe979f9e40f5f74b9d...
CLIENT_URL=http://localhost:5173
```

**Rules:**
- One `KEY=VALUE` per line
- No spaces around the `=` sign
- Lines starting with `#` are comments
- No quotes needed (unless the value has spaces)
- **NEVER commit this file to Git** — it contains real secrets

### 6.4 What is dotenv?

**dotenv** is a tiny npm package that reads your `.env` file and loads each key-value pair into `process.env`.

```javascript
// At the very top of server.js:
const dotenv = require('dotenv');
dotenv.config();
// That's it. Now process.env.PORT, process.env.MONGO_URI, etc. all work.
```

**Why must `dotenv.config()` be the FIRST thing that runs?**

Because if you import another module before calling `dotenv.config()`, that module might try to read `process.env.MONGO_URI` — but it won't exist yet because dotenv hasn't loaded the `.env` file yet.

```javascript
// ❌ WRONG ORDER — db.js reads process.env.MONGO_URI before dotenv loads it
const connectDB = require('./config/db');  // reads MONGO_URI → undefined!
const dotenv = require('dotenv');
dotenv.config();                           // too late!

// ✅ CORRECT ORDER — dotenv loads .env BEFORE anything reads process.env
const dotenv = require('dotenv');
dotenv.config();                           // loads .env first
const connectDB = require('./config/db');  // now MONGO_URI exists
```

### 6.5 .env vs .env.example — The Pattern

| File | Purpose | In Git? | Contains Real Secrets? |
|---|---|---|---|
| `.env` | Your local config with real values | ❌ NO (gitignored) | ✅ YES |
| `.env.example` | Template showing what variables are needed | ✅ YES | ❌ NO (placeholders only) |

When a new developer clones the project:
1. They see `.env.example` in the repo
2. They copy it: `cp .env.example .env`
3. They fill in their own real values
4. Their `.env` is automatically ignored by Git

This pattern ensures:
- Secrets never end up in Git history
- New developers know exactly which variables they need to set
- The `.env.example` file serves as living documentation

### 6.6 What Each Environment Variable Does in JobCaliber

| Variable | Value | Purpose |
|---|---|---|
| `NODE_ENV` | `development` | Tells the app which mode it's in. In development: show detailed errors, enable CORS for localhost. In production: hide stack traces, restrict CORS. |
| `PORT` | `5000` | Which TCP port the Express server listens on. 5000 is our convention for the backend. The React frontend runs on 5173 (Vite's default). |
| `MONGO_URI` | `mongodb://localhost:27017/jobcaliber` | The connection string for MongoDB. `localhost:27017` = your local MongoDB. `jobcaliber` = the database name. In production, this would be a MongoDB Atlas URL. |
| `JWT_SECRET` | `713b72a549ac...` (64-byte hex) | The cryptographic key used to **sign** and **verify** JWT tokens. If someone knows this key, they can forge auth tokens for any user. That's why it must be long, random, and secret. |
| `JWT_EXPIRE` | `7d` | How long a JWT token is valid. `7d` = 7 days. After that, the user must log in again. |
| `COOKIE_SECRET` | `fe979f9e40f5...` (64-byte hex) | Used by `cookie-parser` to **sign** cookies. Signed cookies can't be tampered with by the client — the server can detect modification. |
| `CLIENT_URL` | `http://localhost:5173` | The URL of the React frontend. Used by the CORS middleware to whitelist which origins can make requests to our API. |

---

## 7. How server.js Works (Line by Line)

Here's our actual `server/server.js` and what every line does:

```javascript
// ─── Load environment variables ───
const dotenv = require('dotenv');  // Import the dotenv package
dotenv.config();                   // Read .env file → inject into process.env
// WHY FIRST: Any module imported after this can safely read process.env

// ─── Import Express ───
const express = require('express'); // Import the Express framework

// ─── Create the app ───
const app = express();
// express() is a FACTORY FUNCTION — it creates and returns a new application object.
// This object has methods like .get(), .post(), .use(), .listen()
// Everything in our server gets registered on this single object.

// ─── Define the port ───
const PORT = process.env.PORT || 5000;
// Read PORT from .env (string "5000").
// The || operator provides a fallback: if PORT is undefined, use 5000.
// This is a DEFENSIVE DEFAULT — the app works even without a .env file.

// ─── Health check route ───
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'JobCaliber API is running',
    environment: process.env.NODE_ENV
  });
});
// A simple GET route at the root URL.
// Purpose: quickly verify the server is reachable.
// Will be removed or moved once real routes are added.

// ─── Start the server ───
app.listen(PORT, () => {
  console.log(`JobCaliber server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
// Binds to port 5000 and starts accepting HTTP connections.
// The callback logs a confirmation message.
```

**After Step 2.5 (middleware added), server.js now also includes:**

```javascript
// ─── Import middleware packages ───
const cors = require('cors');            // Cross-Origin Resource Sharing
const helmet = require('helmet');        // Security HTTP headers
const cookieParser = require('cookie-parser');  // Parse cookies from requests
const mongoSanitize = require('./middleware/mongoSanitize');  // Custom NoSQL defense

// ─── Stage 1: CORS ───
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true,  // Allow cookies to be sent cross-origin (essential for JWT)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// WHY: Without CORS, the browser blocks the React app (port 5173) from
// calling our API (port 5000). credentials:true is needed for HttpOnly cookies.

// ─── Stage 2: Helmet ───
app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: { ... } }));
// WHY: Sets ~15 security headers on every response. Prevents clickjacking,
// MIME sniffing, XSS reflection, and more.

// ─── Stage 3: Body parsers ───
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// WHY: Parses JSON bodies into req.body. 10kb limit prevents DoS via huge payloads.

// ─── Stage 4: Cookie parser ───
app.use(cookieParser(process.env.COOKIE_SECRET));
// WHY: Parses cookies into req.cookies. COOKIE_SECRET enables signed cookies
// (tamper detection). Needed before auth middleware reads the JWT cookie.

// ─── Stage 5: NoSQL sanitization ───
app.use(mongoSanitize());
// WHY: Strips $ and . from req.body and req.params to prevent NoSQL injection.
// We wrote a custom version because express-mongo-sanitize is abandoned and
// crashes on Express 5 (req.query is read-only in Express 5).
```

---

## 8. Small Examples

### Example 1: Middleware that logs every request

```javascript
// This runs for EVERY request, regardless of URL or method
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next(); // MUST call next() or the request hangs forever
});

// Output when someone hits GET /api/applications:
// GET /api/applications at 2026-09-29T17:30:00.000Z
```

### Example 2: Route with URL parameter

```javascript
app.get('/api/applications/:id', (req, res) => {
  console.log(req.params.id); // "abc123" if URL was /api/applications/abc123
  res.json({ id: req.params.id });
});
```

### Example 3: Route with query parameters

```javascript
// URL: /api/applications?status=Applied&page=2
app.get('/api/applications', (req, res) => {
  console.log(req.query.status); // "Applied"
  console.log(req.query.page);   // "2" (always a string!)
  res.json({ filters: req.query });
});
```

### Example 4: POST route that reads JSON body

```javascript
app.use(express.json()); // MUST be registered before routes that read req.body

app.post('/api/applications', (req, res) => {
  const { companyName, roleTitle } = req.body; // destructure from parsed JSON
  console.log(`Creating: ${companyName} - ${roleTitle}`);
  res.status(201).json({ success: true });
});
```

---

## 9. Important Terminology

| Term | Definition |
|---|---|
| **Framework** | A pre-built structure that provides tools and conventions for building applications. Express provides routing, middleware, and request/response handling. |
| **Middleware** | A function with access to `req`, `res`, and `next()`. Runs in order. Can modify the request, end the response, or pass to the next function. |
| **Route** | A mapping of an HTTP method + URL path to a handler function. `app.get('/users', handler)` means "when a GET request arrives at /users, run handler." |
| **Route Handler** | The function that executes when a route is matched. Receives `req` and `res`. |
| **Route Parameter** | A dynamic segment in a URL path, prefixed with `:`. `/users/:id` matches `/users/abc123` and puts `"abc123"` in `req.params.id`. |
| **Query String** | Key-value pairs after `?` in a URL. `/users?role=admin&page=2` → `req.query = { role: "admin", page: "2" }`. |
| **req (Request)** | The incoming HTTP request object. Contains `.body`, `.params`, `.query`, `.cookies`, `.headers`. |
| **res (Response)** | The outgoing HTTP response object. Has methods like `.json()`, `.status()`, `.cookie()`, `.send()`. |
| **next()** | A function that passes control to the next middleware in the chain. If not called (and no response is sent), the request hangs forever. |
| **app.use()** | Registers middleware that runs for ALL routes (or for routes matching a specific path prefix). |
| **app.listen()** | Binds the Express app to a TCP port and starts accepting connections. |
| **Environment Variable** | A key-value pair stored outside source code, in the OS environment. Accessed via `process.env.KEY`. |
| **dotenv** | An npm package that reads a `.env` file and injects its variables into `process.env`. |
| **.env file** | A plain text file containing `KEY=VALUE` pairs for local configuration. Never committed to Git. |
| **.env.example** | A template `.env` file with placeholder values, committed to Git so new developers know what variables to set. |
| **Factory Function** | A function that creates and returns a new object. `express()` is a factory that creates an app object. |
| **Defensive Default** | Using `||` to provide a fallback value: `process.env.PORT || 5000`. |

---

## 10. Common Mistakes

### ❌ Mistake 1: Calling dotenv.config() too late

```javascript
// ❌ Wrong — connectDB reads process.env.MONGO_URI before dotenv loads it
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();

// ✅ Right — dotenv loads .env BEFORE any module reads process.env
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
```

### ❌ Mistake 2: Forgetting express.json() middleware

```javascript
// ❌ Without express.json(), req.body is undefined
app.post('/api/auth/register', (req, res) => {
  console.log(req.body); // undefined!
});

// ✅ Register express.json() BEFORE routes
app.use(express.json());
app.post('/api/auth/register', (req, res) => {
  console.log(req.body); // { email: "...", password: "..." }
});
```

### ❌ Mistake 3: Forgetting to call next() in middleware

```javascript
// ❌ Request hangs forever — neither next() nor res.send() is called
app.use((req, res, next) => {
  console.log('Logging...');
  // forgot next()! Request stops here.
});

// ✅ Always either call next() or send a response
app.use((req, res, next) => {
  console.log('Logging...');
  next(); // pass to next middleware
});
```

### ❌ Mistake 4: Middleware order wrong

```javascript
// ❌ Route registered BEFORE express.json() — req.body is undefined
app.post('/api/auth/register', handler);
app.use(express.json());

// ✅ Middleware BEFORE routes
app.use(express.json());
app.post('/api/auth/register', handler);
```

### ❌ Mistake 5: Committing .env to Git

```bash
# ❌ NEVER do this — exposes all secrets in Git history forever
git add server/.env
git commit -m "add config"

# ✅ .env must be in .gitignore. Only commit .env.example.
```

### ❌ Mistake 6: Hardcoding secrets in code

```javascript
// ❌ Secret visible to anyone reading the code or Git history
const JWT_SECRET = 'my-super-secret-key-2024';

// ✅ Read from environment variable
const JWT_SECRET = process.env.JWT_SECRET;
```

---

## 11. Understanding Checklist

Test yourself — can you answer these?

- [ ] What does `express()` return?
- [ ] What is the difference between `app.use()` and `app.get()`?
- [ ] Why does middleware order matter?
- [ ] What are the three parameters of a middleware function?
- [ ] What happens if you don't call `next()` in middleware?
- [ ] What is `req.params` vs `req.query` vs `req.body`?
- [ ] Why must `dotenv.config()` be called before other imports?
- [ ] What is the purpose of `process.env`?
- [ ] Why should `.env` never be committed to Git?
- [ ] What is the difference between `.env` and `.env.example`?
- [ ] Why do we use `process.env.PORT || 5000` instead of just `5000`?
- [ ] What does `app.listen()` actually do?

---

## 12. Official Documentation

| Resource | URL |
|---|---|
| **Express.js Official** | https://expressjs.com/ |
| **Express API Reference** | https://expressjs.com/en/5x/api.html |
| **Express Middleware Guide** | https://expressjs.com/en/guide/using-middleware.html |
| **dotenv npm** | https://www.npmjs.com/package/dotenv |
| **Node.js process.env** | https://nodejs.org/docs/latest/api/process.html#processenv |

---

## 13. Learning Order

```
Express.js (Steps 2.4–2.5) ✅

Previous:
  1. Git         ← version control
  2. MongoDB     ← database concepts
  3. Mongoose    ← ODM schemas
  4. REST API    ← HTTP and endpoint design
  5. Node.js     ← runtime, npm, package.json

Completed:
  6. Express.js  ← server, middleware pipeline, routes, dotenv, .env,
                    CORS, Helmet, body parsing, cookie-parser,
                    NoSQL sanitization, custom middleware

Next:
  7. bcryptjs    ← password hashing (Step 2.10)
  8. JWT         ← authentication tokens (Step 2.12)
```
