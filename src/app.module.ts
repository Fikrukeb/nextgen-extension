import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@mguay/nestjs-better-auth';  
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { DATABASE_CONNECTION } from './database/database-connection';
import { UsersModule } from './users/users.module';
import { BuildingModule } from './building/building.module';
@Module({
  imports: [
     ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule.forRootAsync({
      useFactory: (database: NodePgDatabase) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, {
            provider: 'pg',
          }),
          emailAndPassword: {
            enabled: true,
          },
          trustedOrigins: ['http://localhost:3000'],
        }),
      }),
      inject: [DATABASE_CONNECTION],
    }),
    UsersModule,
    BuildingModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
