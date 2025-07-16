import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    IHttpRequestMethods,
    IDataObject,
  } from "n8n-workflow";
  
  export class EnrichByHandle implements INodeType {
    description: INodeTypeDescription = {
      displayName: "Enrich by Handle",
      name: "enrichByHandle",
      group: ["transform"],
      version: 1,
      description: "Enrich a creator using their handle/username",
      defaults: {
        name: "Enrich by Handle",
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
          description:
            "Your Influencers Club API key. Find it at https://dashboard.influencers.club/api (register: https://dashboard.influencers.club/register). Paste it exactly as shown.",
        },
        {
          displayName: "Handle",
          name: "handle",
          type: "string",
          default: "",
          required: true,
          description: "The username or handle to enrich.",
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
          description: "Platform where the handle is used.",
        },
      ],
    };
  
    async execute(this: IExecuteFunctions) {
      const apiKey = this.getNodeParameter("apiKey", 0) as string;
      const handle = this.getNodeParameter("handle", 0) as string;
      const platform = this.getNodeParameter("platform", 0) as string;
  
      const options: {
        method: IHttpRequestMethods;
        body: IDataObject;
        headers: IDataObject;
        json: boolean;
      } = {
        method: "POST",
        body: { handle, platform } as IDataObject,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        } as IDataObject,
        json: true,
      };
  
      const response = await this.helpers.request(
        "https://api-dashboard.influencers.club/public/v1/enrichment/by-handle",
        options,
      );
  
      return [this.helpers.returnJsonArray([response])];
    }
  }
  