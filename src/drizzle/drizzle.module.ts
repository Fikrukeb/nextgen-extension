import { Global, Module } from "@nestjs/common";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

@Global()
@Module({
  providers: [
    {
      provide: "PG_POOL",
      useFactory: () => new Pool({ connectionString: process.env.DATABASE_URL }),
    },
    {
      provide: "DRIZZLE",
      useFactory: (pool: Pool) => drizzle(pool),
      inject: ["PG_POOL"],
    },
  ],
  exports: ["DRIZZLE", "PG_POOL"],
})
export class DrizzleModule {}
