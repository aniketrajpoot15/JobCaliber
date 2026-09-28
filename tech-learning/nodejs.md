<!-- 📌 WHAT IS THIS FILE? This is the learning guide for Node.js, written for a student who is building JobCaliber. It explains Node.js from the ground up, how the runtime and event loop work, package.json internals, semantic versioning, and connects every concept to the actual project. -->

# Node.js

> **Status:** ✅ `ACTIVE` — introduced in Step 2.1  
> **Category:** Backend Runtime  
> **Used in:** The entire backend execution environment (`server/`)

---

## 1. What Is It?

**Node.js** is an open-source, cross-platform **JavaScript runtime environment** that allows you to execute JavaScript code outside of a web browser.

Historically, JavaScript only ran inside browsers (like Chrome, Firefox, Safari) to make web pages interactive. In 2009, Ryan Dahl took Google Chrome's open-source JavaScript engine (**V8**) and wrapped it in a C++ program with access to the operating system's file system, network, and processes.

That program is Node.js.

```
+-------------------------------------------------------+
|                       YOUR CODE                       |
|                 (server.js, controllers)               |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|                        NODE.JS                        |
|  +------------------------+  +---------------------+  |
|  |       V8 Engine        |  |        libuv        |  |
|  |  (Compiles & executes  |  |  (Event Loop, async |  |
|  |      JavaScript)       |  |  file & network I/O)|  |
|  +------------------------+  +---------------------+  |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|                   OPERATING SYSTEM                    |
|          (Windows/Linux File System, Network)         |
+-------------------------------------------------------+
```

---

## 2. Why Are We Using It?

Node.js is the foundation of the **MERN** stack (MongoDB, Express, React, Node.js). We use it in JobCaliber for three core reasons:

### 1. One Unified Language (Full-Stack JavaScript)
Because both our frontend (React) and backend run JavaScript, we don't have to switch languages or mindsets between client and server. We can share knowledge, regex patterns, data formats, and validation rules across both layers.

### 2. Non-Blocking, Event-Driven I/O
JobCaliber's backend is primarily **I/O-bound** (Input/Output-bound):
- Reading/writing to MongoDB
- Reading/verifying JWT cookies
- Sending HTTP responses

Node.js excels at this because it does not create a new operating system thread for every incoming HTTP request. Instead, a single thread handles thousands of concurrent requests by delegating database queries and network calls to the background and moving on to the next request immediately.

### 3. The NPM Ecosystem
Node comes with **npm** (Node Package Manager), the largest software registry in the world. It provides vetted, industry-standard packages for authentication (`jsonwebtoken`, `bcryptjs`), security (`helmet`, `express-rate-limit`), and database modeling (`mongoose`).

---

## 3. Where Is It Used in Our Project?

| Location | Purpose |
|---|---|
| `server/package.json` | Project manifest: defines project name, scripts, and dependencies |
| `server/package-lock.json` | Exact lockfile of dependency versions and sub-dependencies |
| `server/node_modules/` | The installed external packages downloaded by npm |
| `server/server.js` | The server entry point executed by `node server.js` |
| `client/` (build time) | Vite uses Node.js locally on your machine to build and serve the React development server |

---

## 4. Prerequisites

Before writing Node.js backend code, you should be comfortable with:
- **JavaScript Fundamentals:** Variables (`const`, `let`), arrow functions, template literals, destructuring.
- **Asynchronous JavaScript:** Promises, `async/await`, `try/catch`.
- **JSON:** JavaScript Object Notation syntax (keys and strings in double quotes).
- **Basic Terminal Navigation:** Running commands like `node -v`, `npm init`, `npm install`.

---

## 5. Core Concepts

### 5.1 The Event Loop & Non-Blocking I/O
Traditional web servers (like older Apache PHP setups) allocate a whole OS thread to every user. If 100 users are waiting for the database, 100 threads are blocked waiting.

Node.js is **single-threaded** for executing JavaScript code, but uses a C library called **libuv** to handle system operations (like disk reads and network requests) asynchronously in a background thread pool:

```
Request Comes In ──► Call Stack executes synchronous JS
                          │
                   Is it async I/O? (e.g., User.find())
                   ├── Yes ──► Hand off to OS / libuv thread pool
                   │           Call stack is now FREE to take next request!
                   │
                   └── When DB finishes ──► Callback placed in Event Queue
                                                 │
                                           Event Loop pushes it
                                           to Call Stack when empty
```

### 5.2 CommonJS Modules (`require` and `module.exports`)
Node.js historically uses the CommonJS module system:
- To export code from a file: `module.exports = { connectDB };`
- To import code from another file or package: `const express = require('express');`

*(In frontend React, we will use ES Modules with `import` and `export`, but Express backends standardly use CommonJS).*

### 5.3 What is `package.json`?
`package.json` is the **identity card and control center** of a Node.js project. It tells Node and other developers:
- The project name and version
- How to start the application (`scripts`)
- Which libraries the project needs to run (`dependencies`)
- Which libraries are only needed during development (`devDependencies`)

### 5.4 Semantic Versioning (SemVer)
Versions in `package.json` follow the `MAJOR.MINOR.PATCH` pattern (e.g., `1.4.2`):
- **MAJOR (`1.x.x`):** Breaking changes (code written for v1 might not work on v2).
- **MINOR (`x.4.x`):** New features that are backwards-compatible (safe to update).
- **PATCH (`x.x.2`):** Backwards-compatible bug fixes.

Symbols before the version number:
- `^1.4.2` (Caret): Allows updates to new MINOR and PATCH versions (up to `< 2.0.0`). This is the npm default.
- `~1.4.2` (Tilde): Allows updates to PATCH versions only (up to `< 1.5.0`).
- `1.4.2` (Exact): Locks to this precise version only.

---

## 6. How It Works: The `package.json` Structure

Here is the exact `package.json` we created in Step 2.1:

```json
{
  "name": "jobcaliber-server",
  "version": "1.0.0",
  "description": "Backend API server for JobCaliber - Closed-loop job search intelligence platform",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [
    "jobcaliber",
    "mern",
    "express",
    "mongodb"
  ],
  "author": "",
  "license": "ISC"
}
```

### Line-by-Line Breakdown:
- `"name": "jobcaliber-server"`: Lowercase, URL-friendly identifier for the project.
- `"version": "1.0.0"`: Starting initial release version following SemVer.
- `"main": "server.js"`: The primary entry point file of the application.
- `"scripts"`: Aliases for terminal commands:
  - `npm start`: Runs `node server.js` (used in production environments).
  - `npm run dev`: Runs `nodemon server.js` (used during development so the server restarts automatically whenever we save a file).
- `"license": "ISC"`: Open-source permissive license.

---

## 7. Project-Specific Implementation

In JobCaliber, we maintain a **monorepo** with two separate `package.json` files:

```
JobCaliber/
├── client/              <-- Frontend (React + Vite)
│   └── package.json    <-- Frontend dependencies (react, tailwindcss, recharts)
│
├── server/              <-- Backend (Node + Express)
│   └── package.json    <-- Backend dependencies (express, mongoose, bcryptjs)
│
└── package.json         (Optional root helper, or independent folders)
```

**Why separate them?**
- The backend needs server packages (`bcryptjs`, `mongoose`, `cookie-parser`) that the browser cannot run.
- The frontend needs browser/build packages (`vite`, `tailwindcss`) that the server doesn't execute.
- Separation of concerns ensures zero bloat and clean dependency isolation.

---

## 8. Small Examples

### Running a script with Node
```bash
# Direct execution
node server.js

# Running via npm script
npm start
```

### Passing Environment Variables to Node
Node makes system environment variables accessible via the global `process.env` object:
```javascript
// Accessing PORT from environment or falling back to 5000
const PORT = process.env.PORT || 5000;
console.log(`Server starting on port ${PORT}`);
```

---

## 9. Important Terminology

| Term | Definition |
|---|---|
| **V8** | Google's open-source C++ engine that compiles JavaScript directly into machine code. |
| **libuv** | Multi-platform C library that provides the event loop, thread pool, and asynchronous I/O to Node.js. |
| **Event Loop** | The mechanism that continuously checks the call stack and moves pending asynchronous callbacks from the event queue onto the stack. |
| **npm** | Node Package Manager; the command-line tool used to install, manage, and publish JavaScript packages. |
| **`package-lock.json`** | Auto-generated file that locks the exact versions and hash checksums of every nested dependency installed. |
| **`node_modules/`** | The directory where npm installs packages. Must **always** be in `.gitignore` because it is large and can be regenerated at any time with `npm install`. |

---

## 10. Common Mistakes to Avoid

### 1. Committing `node_modules` to Git
`node_modules` can contain tens of thousands of files and hundreds of megabytes. Never commit it! Always verify `.gitignore` contains `node_modules/`.

### 2. Blocking the Single Thread with Heavy Synchronous Work
Since JavaScript in Node executes on a single thread, never run long-running CPU loops synchronously (like a while loop iterating 10 billion times, or `fs.readFileSync` inside a request handler). It will freeze the server for **all** other users until it finishes. Always use async methods (`fs.promises.readFile`, Mongoose `async/await`).

### 3. Confusing `npm install --save` vs `npm install --save-dev`
- **Dependencies (`--save` or default):** Code needed to run the app in production (e.g. `express`, `mongoose`).
- **DevDependencies (`-D` or `--save-dev`):** Tools only needed while coding on your machine (e.g. `nodemon` for auto-restarting).

---

## 11. Understanding Checklist

Before moving to the next step, verify you can answer these questions:
- [ ] What is the difference between JavaScript running in the browser vs in Node.js?
- [ ] Why is Node.js called "single-threaded, non-blocking"?
- [ ] What is the purpose of `package.json`?
- [ ] What is the difference between `npm start` and `npm run dev`?
- [ ] Why must `node_modules/` never be committed to Git?

---

## 12. Official Documentation
- [Node.js Official Documentation](https://nodejs.org/en/docs/)
- [Node.js Guides: The Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [npm Documentation](https://docs.npmjs.com/)

---

## 13. Learning Order Context

```
PREVIOUS:  docs/Architecture/ (Architecture Specs)
CURRENT:   tech-learning/nodejs.md  <-- YOU ARE HERE
NEXT:      Step 2.2 — Install server dependencies
LATER:     tech-learning/express.md (Step 2.3)
```
