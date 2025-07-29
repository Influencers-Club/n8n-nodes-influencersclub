import { ICredentialType, INodeProperties } from "n8n-workflow";
export declare class InfluencersClubApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    defaults: {
        name: string;
    };
    properties: INodeProperties[];
}
