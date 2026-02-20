import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
export declare class InfluencersClub implements INodeType {
    description: INodeTypeDescription;
    private static buildApiFilters;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
