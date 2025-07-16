"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindLookalikes = void 0;
class FindLookalikes {
    constructor() {
        this.description = {
            displayName: "Find Lookalikes",
            name: "findLookalikes",
            group: ["transform"],
            version: 1,
            description: "Find similar creators based on a given handle",
            defaults: {
                name: "Find Lookalikes",
            },
            inputs: ["main"],
            outputs: ["main"],
            properties: [
                {
                    displayName: "API Key",
                    name: "apiKey",
                    type: "string",
                    default: "",
                    required: true,
                    description: "Your Influencers Club API key. Find it at https://dashboard.influencers.club/api (register: https://dashboard.influencers.club/register). Paste it exactly as shown.",
                },
                {
                    displayName: "Handle",
                    name: "handle",
                    type: "string",
                    default: "",
                    required: true,
                    description: "The username or handle to find lookalike creators for",
                },
                {
                    displayName: "Platform",
                    name: "platform",
                    type: "options",
                    options: [
                        { name: "Instagram", value: "instagram" },
                        { name: "YouTube", value: "youtube" },
                        { name: "TikTok", value: "tiktok" },
                        { name: "Twitter", value: "twitter" },
                    ],
                    default: "instagram",
                    description: "Platform for the handle",
                },
            ],
        };
    }
    async execute() {
        const apiKey = this.getNodeParameter("apiKey", 0);
        const handle = this.getNodeParameter("handle", 0);
        const platform = this.getNodeParameter("platform", 0);
        const body = {
            handle,
            platform,
        };
        const options = {
            method: "POST",
            body,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            json: true,
        };
        const response = await this.helpers.request("https://api-dashboard.influencers.club/public/v1/discovery/enrichment", options);
        return [this.helpers.returnJsonArray([response])];
    }
}
exports.FindLookalikes = FindLookalikes;
