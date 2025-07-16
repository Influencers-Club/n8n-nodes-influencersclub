"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discovery = void 0;
class Discovery {
    constructor() {
        this.description = {
            displayName: 'Discovery',
            name: 'discovery',
            group: ['transform'],
            version: 1,
            description: 'Search for creators using advanced discovery filters',
            defaults: {
                name: 'Discovery',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'API Key',
                    name: 'apiKey',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Your Influencers Club API key. Find it at https://dashboard.influencers.club/api (register: https://dashboard.influencers.club/register). Paste it exactly as shown.',
                },
                {
                    displayName: 'Keyword',
                    name: 'keyword',
                    type: 'string',
                    default: '',
                    description: 'Main keyword to search for (e.g., niche, topic)',
                },
                {
                    displayName: 'Platform',
                    name: 'platform',
                    type: 'options',
                    options: [
                        { name: 'Instagram', value: 'instagram' },
                        { name: 'YouTube', value: 'youtube' },
                        { name: 'TikTok', value: 'tiktok' },
                        { name: 'Twitter', value: 'twitter' },
                    ],
                    default: 'instagram',
                    description: 'Platform to search on',
                },
                {
                    displayName: 'Advanced Filters',
                    name: 'advancedFilters',
                    type: 'fixedCollection',
                    placeholder: 'Add Filters',
                    default: {},
                    options: [
                        {
                            name: 'filters',
                            displayName: 'Filters',
                            values: [
                                {
                                    displayName: 'Audience Country',
                                    name: 'audience_country',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Min Followers',
                                    name: 'min_followers',
                                    type: 'number',
                                    default: 0,
                                },
                                {
                                    displayName: 'Max Followers',
                                    name: 'max_followers',
                                    type: 'number',
                                    default: 0,
                                },
                                {
                                    displayName: 'Min Engagement Rate (%)',
                                    name: 'min_engagement_rate',
                                    type: 'number',
                                    default: 0,
                                },
                                {
                                    displayName: 'Max Engagement Rate (%)',
                                    name: 'max_engagement_rate',
                                    type: 'number',
                                    default: 0,
                                },
                                {
                                    displayName: 'Gender',
                                    name: 'gender',
                                    type: 'options',
                                    options: [
                                        { name: 'Any', value: '' },
                                        { name: 'Male', value: 'male' },
                                        { name: 'Female', value: 'female' },
                                    ],
                                    default: '',
                                },
                                {
                                    displayName: 'Age Range',
                                    name: 'age_range',
                                    type: 'string',
                                    default: '',
                                    description: 'Example: 18-24',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }
    async execute() {
        const apiKey = this.getNodeParameter('apiKey', 0);
        const keyword = this.getNodeParameter('keyword', 0);
        const platform = this.getNodeParameter('platform', 0);
        const advancedFilters = this.getNodeParameter('advancedFilters.filters', 0, {});
        const body = {
            keyword,
            platform,
            ...advancedFilters,
        };
        const options = {
            method: 'POST',
            body,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            json: true,
        };
        const response = await this.helpers.request('https://api-dashboard.influencers.club/public/v1/discovery', options);
        return [this.helpers.returnJsonArray([response])];
    }
}
exports.Discovery = Discovery;
