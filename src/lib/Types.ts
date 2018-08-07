// @ts-ignore
export interface IRawData {
    ts: string;
    type: string;
    gender: string;
    tickets: number;
    salesPlan: number;
    sales: number;
    profitPlan: number;
    profit: number;
    buyers: number;
    cost: number;
    [key: string]: any; // string | number;
}

export interface IColumn {
    id: string;
    label: string;
    type?: string;
    color?: string;
    reports?: string[];
    [key: string]: any; // string | number;
}

export interface IReportRow {
    [key: string]: string | number; // string | number;
}

export interface IChartFilter {
    [key: string]: string[];
}

/**
 *  qwd
 */
export interface IDataChart {
    data: number[];
    label: string;
    labels: string[];
    [key: string]: any; // string | number;
}

export interface IChartDataset {
    yAxisID?: string;
    id: string;
    label: string;
    data: number[];
    backgroundColor: string;
    hoverBackgroundColor: string;
    borderColor: string;
    borderWidth: number;
    fill?: boolean;
    [key: string]: any; // string | number;
}

export interface IChartPieDataset {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    hoverBorderColor: string[];
    hoverBackgroundColor: string[];
    // [key: string]: any; // string | number;
}
