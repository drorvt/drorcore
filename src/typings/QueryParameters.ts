export class QueryParameters {
    page: number;
    maxResults: number;
    filters: Filters;
    search: string;
    sortFields: SortFields;
}
export class SortFields {
    [fieldName: string]: 'ASC' | 'DESC' | 1 | -1 | undefined;
}

export class Filters {
    [fieldName: string]: string[];
}
