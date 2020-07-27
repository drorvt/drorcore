export class QueryParameters {
    page: number;
    maxResults: number;
    filters: Filter[];
    search: string;
    sortFields: SortField[];
}
export class SortField {
    // [fieldName: string]: 'ASC' | 'DESC' | 1 | -1 | undefined;
    fieldName: string;
    value: 'ASC' | 'DESC' | undefined;
}

export class Filter {
    fieldName: string;
    values: string[];
}
