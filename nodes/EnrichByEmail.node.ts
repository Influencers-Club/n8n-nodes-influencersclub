import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    IHttpRequestMethods,
    IDataObject,
  } from "n8n-workflow";
  
  export class EnrichByEmail implements INodeType {
    description: INodeTypeDescription = {
      displayName: "Enrich by Email",
      name: "enrichByEmail",
      group: ["transform"],
      version: 1,
      description: "Enrich a creator using their email address",
      defaults: {
        name: "Enrich by Email",
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
          displayName: "Email",
          name: "email",
          type: "string",
          default: "",
          required: true,
          description: "The email address to enrich.",
        },
      ],
    };
  
    async execute(this: IExecuteFunctions) {
      const apiKey = this.getNodeParameter("apiKey", 0) as string;
      const email = this.getNodeParameter("email", 0) as string;
  
      const options: {
        method: IHttpRequestMethods;
        body: IDataObject;
        headers: IDataObject;
        json: boolean;
      } = {
        method: "POST",
        body: { email } as IDataObject,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        } as IDataObject,
        json: true,
      };
  
      const response = await this.helpers.request(
        "https://api-dashboard.influencers.club/public/v1/enrichment/by-email",
        options,
      );
  
      return [this.helpers.returnJsonArray([response])];
    }
  }
  