export class InfluencersClub {
    constructor() {
        this.description = {
            displayName: "Influencers Club",
            name: "influencersClub",
            group: ["transform"],
            version: 1,
            description: "Interact with Influencers Club API for creator enrichment and discovery",
            defaults: {
                name: "Influencers Club",
            },
            icon: "file:influencersClub.svg",
            subtitle: "={{ $parameter[\"operation\"] }}",
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: "influencersClubApi",
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    noDataExpression: true,
                    options: [
                        {
                            name: "Enrich by Email",
                            value: "enrichByEmail",
                            description: "Enrich a creator using their email address",
                            action: "Enrich a creator using their email address",
                        },
                        {
                            name: "Enrich by Handle",
                            value: "enrichByHandle",
                            description: "Enrich a creator using their handle/username",
                            action: "Enrich a creator using their handle/username",
                        },
                        {
                            name: "Discovery",
                            value: "discovery",
                            description: "Search for creators using advanced filters",
                            action: "Search for creators using advanced filters",
                        },
                        {
                            name: "Find Lookalikes",
                            value: "findLookalikes",
                            description: "Find similar creators based on a given handle",
                            action: "Find similar creators based on a given handle",
                        },
                    ],
                    default: "enrichByEmail",
                },
                // Enrich by Email parameters
                {
                    displayName: "Email",
                    name: "email",
                    type: "string",
                    default: "",
                    required: true,
                    description: "The email address to enrich with social media data",
                    displayOptions: {
                        show: {
                            operation: ["enrichByEmail"],
                        },
                    },
                },
                // Enrich by Handle parameters
                {
                    displayName: "Handle",
                    name: "handle",
                    type: "string",
                    default: "",
                    required: true,
                    description: "The username or handle to enrich with email and social data",
                    displayOptions: {
                        show: {
                            operation: ["enrichByHandle"],
                        },
                    },
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
                        { name: "OnlyFans", value: "onlyfans" },
                        { name: "Twitch", value: "twitch" },
                    ],
                    default: "instagram",
                    description: "Platform where the handle is used",
                    displayOptions: {
                        show: {
                            operation: ["enrichByHandle", "discovery", "findLookalikes"],
                        },
                    },
                },
                // Discovery parameters
                {
                    displayName: "Keyword",
                    name: "keyword",
                    type: "string",
                    default: "",
                    description: "Main keyword to search for creators (e.g., niche, topic, industry)",
                    displayOptions: {
                        show: {
                            operation: ["discovery"],
                        },
                    },
                },
                {
                    displayName: "Advanced Filters",
                    name: "advancedFilters",
                    type: "fixedCollection",
                    placeholder: "Add Filters",
                    default: {},
                    displayOptions: {
                        show: {
                            operation: ["discovery"],
                        },
                    },
                    options: [
                        {
                            name: "filters",
                            displayName: "Filters",
                            values: [
                                {
                                    displayName: "Audience Country",
                                    name: "audience_country",
                                    type: "string",
                                    default: "",
                                },
                                {
                                    displayName: "Min Followers",
                                    name: "min_followers",
                                    type: "number",
                                    default: 0,
                                },
                                {
                                    displayName: "Max Followers",
                                    name: "max_followers",
                                    type: "number",
                                    default: 0,
                                },
                                {
                                    displayName: "Min Engagement Rate (%)",
                                    name: "min_engagement_rate",
                                    type: "number",
                                    default: 0,
                                },
                                {
                                    displayName: "Max Engagement Rate (%)",
                                    name: "max_engagement_rate",
                                    type: "number",
                                    default: 0,
                                },
                                {
                                    displayName: "Gender",
                                    name: "gender",
                                    type: "options",
                                    options: [
                                        { name: "Any", value: "" },
                                        { name: "Male", value: "male" },
                                        { name: "Female", value: "female" },
                                    ],
                                    default: "",
                                },
                                {
                                    displayName: "Age Range",
                                    name: "age_range",
                                    type: "string",
                                    default: "",
                                    description: "Example: 18-24",
                                },
                            ],
                        },
                    ],
                },
                // Find Lookalikes parameters
                {
                    displayName: "Target Handle",
                    name: "targetHandle",
                    type: "string",
                    default: "",
                    required: true,
                    description: "The username or handle to find similar creators for",
                    displayOptions: {
                        show: {
                            operation: ["findLookalikes"],
                        },
                    },
                },
            ],
        };
    }
    async execute() {
        const operation = this.getNodeParameter("operation", 0);
        const credentials = await this.getCredentials("influencersClubApi");
        const apiKey = credentials.apiKey;
        let response;
        switch (operation) {
            case "enrichByEmail": {
                const email = this.getNodeParameter("email", 0);
                const options = {
                    method: "POST",
                    body: { email },
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    json: true,
                };
                response = await this.helpers.request("https://api-dashboard.influencers.club/public/v1/enrichment/by-email", options);
                break;
            }
            case "enrichByHandle": {
                const handle = this.getNodeParameter("handle", 0);
                const platform = this.getNodeParameter("platform", 0);
                const options = {
                    method: "POST",
                    body: { handle, platform },
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    json: true,
                };
                response = await this.helpers.request("https://api-dashboard.influencers.club/public/v1/enrichment/by-handle", options);
                break;
            }
            case "discovery": {
                const keyword = this.getNodeParameter("keyword", 0);
                const platform = this.getNodeParameter("platform", 0);
                const advancedFilters = this.getNodeParameter("advancedFilters.filters", 0, {});
                const body = {
                    keyword,
                    platform,
                    ...advancedFilters,
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
                response = await this.helpers.request("https://api-dashboard.influencers.club/public/v1/discovery", options);
                break;
            }
            case "findLookalikes": {
                const handle = this.getNodeParameter("targetHandle", 0);
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
                response = await this.helpers.request("https://api-dashboard.influencers.club/public/v1/discovery/enrichment", options);
                break;
            }
            default:
                throw new Error(`Operation ${operation} not supported`);
        }
        return [this.helpers.returnJsonArray([response])];
    }
}
