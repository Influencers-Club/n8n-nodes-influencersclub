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
exports.EnrichByEmail = void 0;
class EnrichByEmail {
    constructor() {
        this.description = {
            displayName: 'Enrich by Email',
            name: 'enrichByEmail',
            group: ['transform'],
            version: 1,
            description: 'Enrich a creator using their email address',
            defaults: {
                name: 'Enrich by Email',
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
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The email address to enrich.',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = this.getNodeParameter('apiKey', 0);
            const email = this.getNodeParameter('email', 0);
            const options = {
                method: 'POST',
                body: { email },
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                json: true,
            };
            const response = yield this.helpers.request('https://api-dashboard.influencers.club/public/v1/enrichment/by-email', options);
            return [this.helpers.returnJsonArray([response])];
        });
    }
}
exports.EnrichByEmail = EnrichByEmail;
