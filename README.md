# Inkloom AI – Brand Governance Platform (MERN)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-inkloomai.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://inkloomai.vercel.app)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20SPA-blue?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Backend-Express-black?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> 🚀 **Live Application:** **[https://inkloomai.vercel.app](https://inkloomai.vercel.app)**

Check content against approved guidelines and facts **before** it is published, see why each issue was flagged and which source it comes from, fix it, and send it through human approval with a full audit trail.

---

## 🌐 Live Deployment
- **Website URL:** [https://inkloomai.vercel.app](https://inkloomai.vercel.app)
- **Evaluation Demo Accounts** (Password: `Passw0rd!demo`):
  - **Admin:** `admin@demo.test`
  - **Creator:** `creator@demo.test`
  - **Reviewer:** `reviewer@demo.test`

---

## What works
- Register a workspace (first user becomes admin), JWT login, roles: **admin**, **creator**, **reviewer**
- Brand kit: approved facts (versioned, with an optional exact-value check) and guidelines (terminology, claims, tone)
- Hybrid review: deterministic rules and fact checks, source retrieval, and optional AI analysis (OpenAI-compatible API)
- Every finding shows the excerpt, reason, severity, evidence source (or "no supporting source found") and a suggested fix
- Accept or reject suggestions. Accepting creates a new version and re-runs the checks automatically
- Version comparison (word-level diff)
- Submit, approve, request changes, reject. No self-approval. Critical issues block approval unless a reviewer overrides with a written reason
- Audit trail, dashboard and governance analytics (common violations, time to approval, rules people keep rejecting)

## Not built yet
PDF/DOCX upload, image analysis, asset library, settings page, vector search, email invites.

## Run it locally
Requires Node 18+ and MongoDB (local or Atlas).

```bash
cd server
cp .env.example .env      # set MONGODB_URI and a long JWT_SECRET
npm install
npm run seed              # demo organisation, users, facts and rules
npm run dev               # http://localhost:5000/api/health

cd ../client
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

The client is a lightweight Vite app with a public product introduction, a newsletter interest form, and workspace sign-in/registration. Set `VITE_API_URL` in `client/.env` if your API is not at `http://localhost:5000/api`. It supports draft reviews, text-file import, optional suggestions, versioned editing, human approvals, brand-kit management, team roles, and governance insights. Built-in accessibility checks flag missing image alt text and vague HTML/Markdown link labels. Newsletter interest is stored in MongoDB only after an email address is submitted; no marketing emails are sent because an email delivery provider has not been configured. The submitter can remove the address using the unsubscribe control. PDF upload and visual/image analysis are not supported.

AI is optional. Set `AI_API_KEY` (and `AI_API_URL`, `AI_MODEL`) in `server/.env` to turn it on. Without a key the rule engine still works. If the provider fails, the review falls back to rules only.

`npm test` in `server/` runs the rule-engine tests.

## Demo script
1. Admin: Brand kit shows the 14-day trial fact and the claims rules.
2. Creator: New review, paste `Try our product free for 60 days! It is the best platform in the world, and we guarantee 100% success.`
3. See three findings with sources and fixes. Accept one, reject another.
4. Submit for approval.
5. Reviewer: open it from Approvals, request changes or approve.
6. Open the audit trail and Analytics.

## Security notes
- Keep `.env` out of Git. AI keys stay on the server.
- Every query is filtered by `organisationId`, so users cannot read another organisation's data by changing an id.
- Uploaded or pasted text is treated as untrusted. The AI prompt ignores instructions inside content, AI excerpts must exist in the text, and citations must come from retrieved sources.
- Only the text needed for review is sent to the AI provider. Disclose this to users and check your provider's retention policy.
- The token is stored in `localStorage` for simplicity. For production, prefer httpOnly cookies.
- Guideline patterns are admin-entered regular expressions. Only trust admins with this.
