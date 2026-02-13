"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluencersClubApi = void 0;
class InfluencersClubApi {
    constructor() {
        this.name = "influencersClubApi";
        this.displayName = "Influencers Club API";
        this.documentationUrl = "https://dashboard.influencers.club/api";
        this.defaults = {
            name: "Influencers Club API",
        };
        this.authenticate = {
            type: "generic",
            properties: {
                headers: {
                    Authorization: "=Bearer {{$credentials.apiKey}}",
                    "Content-Type": "application/json",
                    "X-Origin": "n8n",
                    "X-Integration": "influencers-n8n",
                },
            },
        };
        this.properties = [
            {
                displayName: "API Key",
                name: "apiKey",
                type: "string",
                typeOptions: {
                    password: true,
                },
                default: "",
                description: "Your Influencers Club API key. Find it at https://dashboard.influencers.club/api",
                required: true,
            },
        ];
        this.test = {
            request: {
                url: 'https://api-dashboard.influencers.club/public/v1/creators/enrich/email/',
                method: 'POST',
                body: {
                    email: 'test@example.com',
                },
            },
        };
    }
}
exports.InfluencersClubApi = InfluencersClubApi;
