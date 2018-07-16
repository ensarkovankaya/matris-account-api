export interface ICompareDateInput {
    eq?: Date;
    gt?: Date;
    gte?: Date;
    lt?: Date;
    lte?: Date;
}

export interface ICompareNullableDateInput {
    eq?: Date | null;
    gt?: Date;
    gte?: Date;
    lt?: Date;
    lte?: Date;
}

export interface ICompareNumberInput {
    eq?: number;
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
}
