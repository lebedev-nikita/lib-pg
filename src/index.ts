import jsonBigint from "json-bigint";
import postgres from "postgres";
import pgPromise from "pg-promise";

export function createSql(config: {
  host: string;
  port: number;
  db: string;
  user: string;
  password: string;
  schema?: string;
}) {
  // Идентификатор типа JSONB в постгресе
  const JSONB_OID = 3802;

  return postgres({
    host: config.host,
    port: config.port,
    db: config.db,
    user: config.user,
    password: config.password,

    onnotice() {},

    types: {
      // Большие инты (например, хэши) из JSONB не помещаются в JS-овый тип number.
      // Настраиваем их преобразование в строки.
      jsonb: {
        from: [JSONB_OID],
        to: JSONB_OID,
        serialize: JSON.stringify,
        parse: (str: string) => jsonBigint({ storeAsString: true }).parse(str),
      },
    },
    transform: {
      // Настраиваем преобразование колонок в camelCase
      column: postgres.camel.column,
    },
    connection: {
      // Настраиваем search_path, чтобы не писать имя схемы в каждом запросе
      search_path: config.schema,
    },
    debug(_, query, params) {
      const formatted = pgPromise.as.format(query, params);
      if (formatted.includes("--debug=true")) {
        console.log(formatted);
      }
    },
  });
}

export const ISOLATION_LEVEL = {
  RC_RW: "ISOLATION LEVEL READ COMMITTED READ WRITE",
  S_RW: "ISOLATION LEVEL SERIALIZABLE READ WRITE",
} as const;
