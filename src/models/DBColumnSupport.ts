import { Column, ColumnOptions, ColumnType } from 'typeorm';

const production: any = process.env.PRODOCTION;

const mysqlSqliteTypeMapping: { [key: string]: ColumnType } = {
  'mediumtext': 'text',
  'timestamp': 'datetime',
  'mediumblob': 'blob'
};

export function setAppropriateColumnType(mySqlType: ColumnType): ColumnType {
  const isTestEnv = process.env.NODE_ENV === 'test';
  if (!production) {
    return mysqlSqliteTypeMapping[mySqlType.toString()];
  }
  return mySqlType;
}

export function DbAwareColumn(columnOptions: ColumnOptions) {
  if (columnOptions.type) {
    columnOptions.type = setAppropriateColumnType(columnOptions.type);
  }
  return Column(columnOptions);
}