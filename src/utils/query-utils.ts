import { QueryParameters, Filter } from '../typings/QueryParameters';
import { SelectQueryBuilder, Brackets } from 'typeorm';

// TODO: Consider using "IN"
export function createFilter(filter: Filter): Brackets {
    return new Brackets(qb => {
        for (let i = 0; i < filter.values.length; i++) {
            const condition =
                // tslint:disable-next-line: quotemark
                filter.fieldName + ' = ' + "'" + filter.values[i] + "'";
            i == 0 ? qb.where(condition) : qb.orWhere(condition);
        }
    });
}

export function createFilters<T>(
    queryParameters: QueryParameters,
    qb: SelectQueryBuilder<T>
) {
    for (let i = 0; i < queryParameters.filters.length; i++) {
        const filter = createFilter(queryParameters.filters[i]);
        i == 0 ? qb.where(filter) : qb.andWhere(filter);
    }
}

export function createSortFields<T>(
    queryParameters: QueryParameters,
    qb: SelectQueryBuilder<T>
) {
    if (queryParameters.sortFields) {
        for (let i = 0; i < queryParameters.sortFields.length; i++) {
            i == 0
                ? qb.orderBy(
                      queryParameters.sortFields[i].fieldName,
                      queryParameters.sortFields[i].value
                  )
                : qb.addOrderBy(
                      queryParameters.sortFields[i].fieldName,
                      queryParameters.sortFields[i].value
                  );
        }
    }
}

export function createPaging<T>(
    queryParameters: QueryParameters,
    qb: SelectQueryBuilder<T>
) {
    qb.skip((queryParameters.maxResults | 100) * (queryParameters.page | 0));
    qb.take(queryParameters.maxResults | 100);
}

export function createFreeTextSearch<T>(
    queryParameters: QueryParameters,
    qb: SelectQueryBuilder<T>,
    searchFields: string[] = ['address']
) {
    if (searchFields.length == 0) {
        throw new Error(
            'Error creating free-text search expression - no search fields'
        );
    }
    if (!queryParameters.search) {
        return qb;
    }
    const brackets = new Brackets(qb => {
        for (let i = 0; i < searchFields.length; i++) {
            const condition =
                searchFields[i] +
                ' LIKE ' +
                // tslint:disable-next-line: quotemark
                "'%" +
                queryParameters.search +
                // tslint:disable-next-line: quotemark
                "%'";
            i == 0 ? qb.where(condition) : qb.orWhere(condition);
        }
    });
    qb.andWhere(brackets);
}
