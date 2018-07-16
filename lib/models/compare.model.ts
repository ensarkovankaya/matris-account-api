export interface ICompareModel {
    eq?: number | Date;
    gt?: number | Date;
    gte?: number | Date;
    lt?: number | Date;
    lte?: number | Date;
}

export interface INullableCompareModel {
    eq?: number | Date | null;
    gt?: number | Date;
    gte?: number | Date;
    lt?: number | Date;
    lte?: number | Date;
}
