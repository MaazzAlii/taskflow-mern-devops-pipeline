# Git & GitHub Repository Setup — TaskFlow

> **Repository Identity:**
> - **Public Repository:** [https://github.com/MaazzAlii/taskflow-mern-devops-pipeline](https://github.com/MaazzAlii/taskflow-mern-devops-pipeline)
> - **Primary Branch:** `main`

---

## 🔒 Security Audit & Branch Protection

1. **Ignored Meta Files:**
   - `.env`, `.env.*` (Environment secrets)
   - `node_modules/` (Dependencies)
   - `dist/`, `build/`, `coverage/` (Generated build/test outputs)
   - `00-START-HERE.md`, `DevOps_Playlist_Master_Notes.md`, `mern-devops-prompts-final/` (Prompt meta-files)

2. **Commit Policy:**
   - Every feature, bugfix, refactor, and documentation update is committed individually with clear, standardized messages (`feat:`, `chore:`, `test:`, `build:`, `docs:`, `style:`, `refactor:`).
   - Direct push to remote `main` branch with CI status check enforcement.
