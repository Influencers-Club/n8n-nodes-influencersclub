"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrichByHandle = void 0;
class EnrichByHandle {
    constructor() {
        this.description = {
            displayName: 'Enrich by Handle',
            name: 'enrichByHandle',
            group: ['transform'],
            version: 1,
            description: 'Enrich a creator using their handle/username',
            defaults: {
                name: 'Enrich by Handle',
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
                    displayName: 'Handle',
                    name: 'handle',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The username or handle to enrich.',
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
                        { name: 'OnlyFans', value: 'onlyfans' },
                        { name: 'Twitch', value: 'twitch' },
                    ],
                    default: 'instagram',
                    description: 'Platform where the handle is used.',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = this.getNodeParameter('apiKey', 0);
            const handle = this.getNodeParameter('handle', 0);
            const platform = this.getNodeParameter('platform', 0);
            const options = {
                method: 'POST',
                body: { handle, platform },
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                json: true,
            };
            const response = yield this.helpers.request('https://api-dashboard.influencers.club/public/v1/enrichment/by-handle', options);
            return [this.helpers.returnJsonArray([response])];
        });
    }
}
exports.EnrichByHandle = EnrichByHandle;
