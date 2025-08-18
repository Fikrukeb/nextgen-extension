import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@mguay/nestjs-better-auth';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database/database-connection';
import { UsersModule } from './users/users.module';
import { BuildingModule } from './building/building.module';
import { TenantModule } from './tenant/tenant.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { createAuthClient } from './auth/auth';
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule.forRootAsync({
      useFactory: (database: NodePgDatabase) => ({
        auth: createAuthClient(database),
      }),
      inject: [DATABASE_CONNECTION], 
    }),
    UsersModule,
    BuildingModule,
    TenantModule,
    DrizzleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
