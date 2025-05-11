# @y87cgp/pg

My wrapper around [postgres](https://www.npmjs.com/package/postgres) library

## Usage

```ts
import { createSql } from "@y87cgp/pg";

export const sql = createSql({
  db: process.env.PG_DB!,
  host: process.env.PG_DB!,
  port: +process.env.PG_DB!,
  password: process.env.PG_DB!,
  user: process.env.PG_DB!,
  schema: process.env.PG_SCHEMA!,
});
```
