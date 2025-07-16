# n8n-nodes-influencersclub

Official n8n nodes for Influencers Club enrichment API.

## 🚀 Overview

This repository provides four official n8n nodes for Influencers Club:

- **Enrich by Email**: Takes an email address and enriches it with public social data, including possible usernames, followers, profile links, bio, and other social metrics. This is useful if you have a list of customer or subscriber emails and want to find their social presence and additional profile information.

- **Enrich by Handle**: Takes a social media handle (username) and platform, and enriches it with email (if available), followers, bio, links, and additional social metrics. This is useful if you have scraped or collected social handles and want to obtain verified emails or extra data.

- **Discovery**: Search for creators using advanced filters such as keyword, platform, audience country, follower range, engagement rate, and more. The node provides full flexibility and matches the official API documentation.

- **Find Lookalikes**: Find similar creators to a given handle on a specified platform. This is useful for building lookalike lists for outreach or audience expansion.


These nodes help marketing and growth teams enrich leads, segment audiences, sync to CRM systems, or prepare personalized outreach workflows.

---

## 🔑 How to get your API Key

To use these nodes, you need an **API Key** from your Influencers Club account.

### Steps

1. **Register** at [Influencers Club Dashboard](https://dashboard.influencers.club/register).
2. After logging in, open the [API page](https://dashboard.influencers.club/api).
3. Copy your **API Key** displayed there.

**All requests require a Bearer token:**



Paste this key into the "API Key" field inside each node in your n8n workflow.

---

## ⚡ Example workflows

- Import a list of email addresses from Google Sheets ➜ Enrich by Email ➜ Push to CRM or Airtable.
- Import a list of Instagram handles ➜ Enrich by Handle ➜ Get emails ➜ Send personalized outreach via Gmail node.

---

## 🛠️ Installation

Install via npm:

```bash
npm install n8n-nodes-influencersclub
```
Then, add to your n8n instance as a custom node package.


# 💥 **Why your nodes do not appear yet**

Even with correct code, your package **must be loaded by n8n** correctly (custom extensions or Community Nodes). Right now:

- **You are using local env variable method**: `$env:N8N_CUSTOM_EXTENSIONS="n8n-nodes-influencersclub"`.
- The package and dist files must include **built `.js` files**, not just `.ts`.
- Your `dist/` folder must be correctly built and included in npm (which you did recently).  

---

# ✅ **Next steps (final confirmation)**

1️⃣ Your **code is now correct** — confirmed.  
2️⃣ Your **npm package is correct** — confirmed.  
3️⃣ Your **README** can be updated (optional).  
4️⃣ You need to make sure your local n8n actually loads the package correctly:

```powershell
$env:N8N_CUSTOM_EXTENSIONS="n8n-nodes-influencersclub"; npx n8n start
---

## 📄 License

MIT

---

## 💬 Support

For questions, contact [Influencers Club Support](https://dashboard.influencers.club) or [open an issue](https://github.com/Influencers-Club/n8n-nodes-influencersclub/issues).
