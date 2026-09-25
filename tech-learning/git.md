<!-- 📌 WHAT IS THIS FILE? This is the learning guide for Git version control, written for a student who is building JobCaliber. It explains Git from the ground up, connects every concept to the actual project, and includes a checklist to verify your understanding before moving forward. -->

# Git

> **Status:** ✅ `ACTIVE` — in use since Step 0.11  
> **Category:** Version Control  
> **Used in:** Every step (all code and docs are version-controlled)

---

## 1. What Is It?

**Git** is a **version control system** — a tool that records every change you make to your files over time, so you can go back to any previous version whenever you want.

Think of it like an **infinite undo system** for your entire project. Every time you "commit" (save a snapshot), Git remembers exactly what every file looked like at that moment. You can always go back, compare versions, or undo mistakes.

The key difference between Git and just pressing Ctrl+Z:
- Ctrl+Z only works within one file, within one editing session
- Git works across **all files**, across **all time**, even after you close your editor, restart your computer, or come back months later

Git is also **distributed** — your entire project history lives on your own computer. You don't need an internet connection to commit, view history, or undo changes.

> **Git vs GitHub:** Git is the tool on your computer. GitHub is a website that hosts Git repositories online so you can share code, collaborate, and back up your work. Git works without GitHub. GitHub requires Git.

---

## 2. Why Are We Using It?

Git solves three critical problems for JobCaliber:

### Problem 1: "What did I change and when?"
Without Git, you'd have folders named `JobCaliber_v1`, `JobCaliber_v2_final`, `JobCaliber_v2_final_REAL`. With Git, every change is automatically timestamped and described with a message you write (like `"feat: add Application schema"`).

### Problem 2: "I broke something and need to go back"
Without Git, if you accidentally delete important code or introduce a bug, you might not remember what the working version looked like. With Git, you can instantly revert any file or the entire project to any previous commit.

### Problem 3: "I need to keep secrets out of my code"
JobCaliber will have a `.env` file with database passwords, JWT secrets, and other sensitive data. Git's `.gitignore` file tells Git to **pretend certain files don't exist** — so they never get uploaded to GitHub where anyone could see them.

**Project-specific reasons:**
- `AGENTS.md` §14 mandates meaningful commits, small commits, and never committing secrets
- The Inspect → Plan → Implement → Test → Review workflow (AGENTS.md §13) requires traceable atomic changes
- The monorepo structure (`client/` + `server/` in one repo) requires a single `.gitignore` at the root

---

## 3. Where Is It Used in Our Project?

| Location | What Git Does There |
|---|---|
| `.git/` (hidden folder) | Stores the entire project history — every commit, every version of every file |
| `.gitignore` | Lists files/folders Git should ignore (secrets, dependencies, build output) |
| Every file in the project | All tracked by Git — you can see when each was created, modified, and by whom |

**Current Git state (as of Step 1.2):**
```
$ git log --oneline
783fb8a docs: define Application collection schema (Step 1.2)
2f1ad0a (previous commits from Phase 0 and Step 1.1)
```

---

## 4. Prerequisites

Before learning Git, you should understand:

- [x] **Files and folders** — how your computer's file system organizes things
- [x] **Command line basics** — how to type commands in a terminal (PowerShell or Terminal)
- [x] **Text files** — that code files are just plain text files with special extensions (`.js`, `.md`, `.json`)

You do NOT need to know any programming language to learn Git.

---

## 5. Core Concepts I Need to Know

### Concept 1: The Three Areas

Every Git project has three areas where your files can be:

```
[ Working Directory ]  ──git add──►  [ Staging Area ]  ──git commit──►  [ Repository ]
   (your actual files)               (files prepared                    (permanent history —
                                      for next commit)                   snapshots saved forever)
```

**Working Directory:** The real files on your disk — what you see in VS Code.

**Staging Area (Index):** A "preparation zone." When you run `git add`, you're saying "I want to include this file's changes in my next commit." You can add some files and leave others out.

**Repository:** The permanent history stored inside the hidden `.git/` folder. When you run `git commit`, everything in the staging area becomes a permanent snapshot.

**Why a staging area?** It lets you commit *some* changes without committing *everything*. For example, if you changed 5 files but only 3 are ready, you can add just those 3 and commit them. The other 2 stay in your working directory, uncommitted.

### Concept 2: Commits

A **commit** is a snapshot — a permanent record of what your project looked like at one moment in time. Every commit has:
- A unique **ID** (a long string of letters and numbers, like `783fb8a...`)
- A **message** you write describing what changed (like `"docs: define Application collection schema"`)
- A **timestamp** (when the commit was made)
- A **parent** (which commit came before it)

Commits form a chain. Each commit points back to the commit before it:
```
[Commit 1] ◄── [Commit 2] ◄── [Commit 3] ◄── [HEAD]
                                                  ↑
                                           you are here
```

### Concept 3: `.gitignore`

A `.gitignore` file tells Git which files to pretend don't exist. Git will never track, stage, or commit these files.

**Why is this critical?**
- **Security:** `.env` files contain passwords and secrets. If committed to GitHub, anyone can see them.
- **Performance:** `node_modules/` contains thousands of files (50,000+). Tracking them would make Git unbearably slow.
- **Cleanliness:** Build outputs (`dist/`), OS files (`Thumbs.db`), and editor settings (`.vscode/`) are noise — they don't belong in your project history.

### Concept 4: Branches

A **branch** is a separate line of development. By default, you're on the `main` branch. You can create new branches to work on features without affecting `main`.

```
main:    [A] ── [B] ── [C]
                   \
feature:            [D] ── [E]   ← work on feature without affecting main
```

When the feature is ready, you **merge** it back into `main`.

> In JobCaliber, we're currently working directly on `main` since it's a solo project. Branches become more important when collaborating or when you want to try risky experiments without breaking your working code.

### Concept 5: Remote Repositories

A **remote** is a copy of your repository hosted somewhere else (like GitHub). 
- `git push` sends your local commits to the remote
- `git pull` downloads new commits from the remote to your local machine

**JobCaliber rule:** We do NOT push to GitHub unless you explicitly ask.

---

## 6. How It Works

### What happens when you run common Git commands:

**`git status`** — "What's changed since my last commit?"
```
Git compares:
- Working Directory vs. Staging Area → shows "Changes not staged for commit"
- Staging Area vs. Last Commit → shows "Changes to be committed"
- New files not tracked by Git → shows "Untracked files"
```

**`git add <file>`** — "I want to include this file in my next commit"
```
1. Git reads the file content
2. Git compresses the content
3. Git calculates a unique hash (like a fingerprint) for the content
4. Git stores the compressed content in .git/objects/
5. Git records "this file → this hash" in the staging area (.git/index)
```

**`git commit -m "message"`** — "Save a permanent snapshot with this description"
```
1. Git takes everything in the staging area
2. Git creates a "tree" object (a directory listing of all staged files)
3. Git creates a "commit" object (tree + parent commit + author + message + timestamp)
4. Git moves the branch pointer (main) forward to this new commit
5. The staging area stays as-is (it now matches the latest commit)
```

### What happens when `.gitignore` is active:

```
You run: git add .    (add everything)
         │
         ▼
Git scans your project folder
         │
         ├── Finds "server/.env"
         │     ├── Checks .gitignore → matches ".env" pattern
         │     └── SKIPPED — Git pretends this file doesn't exist
         │
         ├── Finds "node_modules/express/..."
         │     ├── Checks .gitignore → matches "node_modules/" pattern
         │     └── SKIPPED — Git doesn't even open this folder
         │
         ├── Finds "docs/Architecture/DATABASE_SCHEMA.md"
         │     ├── Checks .gitignore → no match
         │     └── ADDED to staging area
```

---

## 7. Project-Specific Implementation

### Our `.gitignore` (at project root):

The file is organized into clear categories:

```gitignore
# Dependencies — tens of thousands of files, never commit
node_modules/

# Secrets — passwords, API keys, NEVER commit
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs — generated code, not source
client/dist/
client/build/
server/dist/

# Logs — temporary diagnostic files
logs/
*.log

# OS files — system-generated noise
.DS_Store        ← macOS creates this automatically
Thumbs.db        ← Windows creates this for image thumbnails

# Editor files — personal IDE settings
.vscode/
.idea/
```

**Why these specific categories?**
- `node_modules/` → Recreated by `npm install`. Committing it would add ~50MB of third-party code to your repo.
- `.env` → Contains `MONGO_URI`, `JWT_SECRET`. If pushed to GitHub, anyone could access your database.
- `client/dist/` → Generated by `npm run build`. Committing it is like committing a compiled `.exe` alongside your source code — redundant and large.

### Our commit message format (from AGENTS.md §14):

```
<type>: <description>

Examples:
feat: add application model
fix: stale calculation off-by-one
docs: define Application collection schema (Step 1.2)
```

| Type | When to Use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation changes only |
| `refactor` | Code restructuring (no behavior change) |
| `style` | Formatting, whitespace (no logic change) |
| `test` | Adding or fixing tests |
| `chore` | Maintenance tasks (dependencies, config) |

---

## 8. Small Examples

### Example 1: Check what's changed
```bash
git status
```
Output:
```
On branch main
Changes not staged for commit:
    modified:   docs/Architecture/DATABASE_SCHEMA.md

Untracked files:
    tech-learning/README.md
```
This tells you: one existing file was modified, one new file was created but not yet tracked.

### Example 2: Stage and commit specific files
```bash
git add docs/Architecture/DATABASE_SCHEMA.md    # Stage just this file
git add tech-learning/README.md             # Stage this file too
git commit -m "docs: add Application schema and tech-learning index"
```

### Example 3: Stage everything at once
```bash
git add .                    # Stage ALL changes (new, modified, deleted)
git add -A                   # Same thing — stages everything
git commit -m "docs: update all files for Step 1.2"
```

### Example 4: View recent commit history
```bash
git log --oneline -5         # Show last 5 commits, one line each
```
Output:
```
783fb8a docs: define Application collection schema (Step 1.2)
2f1ad0a docs: reorganize project documentation
...
```

### Example 5: Check which `.gitignore` rule is blocking a file
```bash
git check-ignore -v server/.env
```
Output:
```
.gitignore:12:.env    server/.env
```
This tells you: line 12 of `.gitignore` has the rule `.env` that's blocking `server/.env`.

---

## 9. Important Terminology

| Term | Definition |
|---|---|
| **Repository (repo)** | A project folder tracked by Git (contains a hidden `.git/` directory) |
| **Commit** | A permanent snapshot of your project at a point in time |
| **Stage (add)** | Mark a file's changes for inclusion in the next commit |
| **Working Directory** | The actual files on your disk that you edit |
| **Staging Area (Index)** | The preparation zone between your files and the next commit |
| **HEAD** | A pointer to the latest commit on your current branch |
| **Branch** | A named pointer to a chain of commits (default: `main`) |
| **Remote** | A copy of your repo hosted elsewhere (e.g., GitHub) |
| **Push** | Send your local commits to the remote |
| **Pull** | Download remote commits to your local repo |
| **Merge** | Combine two branches' histories together |
| **Clone** | Download an entire remote repo (with full history) to your machine |
| **Untracked** | A file Git has never seen before |
| **Ignored** | A file matching a `.gitignore` pattern — Git pretends it doesn't exist |
| **Hash (SHA)** | A unique fingerprint for content, like `783fb8a...` |
| **Blob** | Git's internal storage for a single file's compressed content |
| **Tree** | Git's internal storage for a directory listing |

---

## 10. Common Mistakes

### Mistake 1: Adding `.env` to `.gitignore` AFTER it was already committed
**What happens:** `.gitignore` only ignores *untracked* files. If `.env` was already committed, Git keeps tracking it even after you add it to `.gitignore`.

**How to fix:**
```bash
git rm --cached .env           # Remove from Git's tracking, keep the file on disk
git commit -m "fix: stop tracking .env file"
```

### Mistake 2: Committing `node_modules/`
**What happens:** Your repo balloons from 5MB to 500MB. Every clone takes minutes instead of seconds. Pull requests become impossible to review.

**How to fix:** Add `node_modules/` to `.gitignore` before running `npm install`. If already committed:
```bash
git rm -r --cached node_modules/
git commit -m "fix: remove node_modules from tracking"
```

### Mistake 3: Writing useless commit messages
**Bad:** `"update"`, `"fix stuff"`, `"asdfg"`, `"WIP"`  
**Good:** `"feat: add Application model with 7-stage status enum"`, `"fix: stale calculation off-by-one error"`

A commit message should answer: *"If I read this 6 months from now, will I understand what changed and why?"*

### Mistake 4: Committing everything in one giant commit
**Bad:** One commit with 20 files changed across 5 features  
**Good:** 5 separate commits, each doing one logical thing

The rule in AGENTS.md §14: **One logical change per commit.**

### Mistake 5: Trying to re-include a file inside an ignored directory
```gitignore
# This does NOT work:
logs/
!logs/important.log    ← Git already skipped the entire logs/ folder

# This DOES work:
logs/*                  ← Ignore files inside logs, but Git still enters the folder
!logs/important.log    ← Now this re-inclusion works
```

---

## 11. Things I Should Understand Before Moving Forward

- [ ] I understand that Git records snapshots, not diffs (changes)
- [ ] I can explain the three areas: Working Directory → Staging Area → Repository
- [ ] I understand what a commit is and what information it contains
- [ ] I know why `.gitignore` exists and what problems it solves
- [ ] I can explain why `.env` files must NEVER be committed
- [ ] I know the difference between `git add` and `git commit`
- [ ] I understand that `.gitignore` only ignores *untracked* files
- [ ] I know how to fix a file that was accidentally committed before `.gitignore` was set up
- [ ] I can write meaningful commit messages following the `<type>: <description>` format
- [ ] I understand the difference between Git (local tool) and GitHub (cloud hosting)
- [ ] I know where our `.gitignore` file is and what each section does

---

## 12. Official Documentation

### Primary (authoritative) sources:
- [Git Official Documentation](https://git-scm.com/doc) — the reference for all Git commands
- [Git `.gitignore` Reference](https://git-scm.com/docs/gitignore) — pattern syntax and behavior
- [Pro Git Book (free, by Scott Chacon & Ben Straub)](https://git-scm.com/book/en/v2) — the best comprehensive Git book, available free online
- [GitHub Docs — Ignoring Files](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files)

### Secondary (high-quality learning) resources:
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials) — beginner-friendly visual explanations
- [Git Internals — Chapter 10 of Pro Git](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain) — deep dive into how Git stores data internally

---

## 13. Learning Order

Learn Git concepts in this order:

```
1. What Git is and why it exists
   ↓
2. The Three Areas (Working Directory → Staging → Repository)
   ↓
3. Basic commands: git init, git status, git add, git commit, git log
   ↓
4. .gitignore — what to exclude and why (security, performance, cleanliness)
   ↓
5. Commit message conventions — the <type>: <description> format
   ↓
6. git diff — viewing what changed before committing
   ↓
7. Branches — creating, switching, merging (when you need parallel work)
   ↓
8. Remote operations — git push, git pull, git clone (when you use GitHub)
   ↓
9. Git internals — blobs, trees, commits, SHA hashing (for deep understanding)
```

> For JobCaliber right now, you need steps 1–5. Steps 6–9 become important as the project grows.
