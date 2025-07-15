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

_Coming soon_ — these nodes will be published to npm and n8n Community Nodes.

---

## 📄 License

MIT

---

## 💬 Support

For questions, contact [Influencers Club Support](https://dashboard.influencers.club) or [open an issue](https://github.com/Influencers-Club/n8n-nodes-influencersclub/issues).
