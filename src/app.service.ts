import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database/database-connection';
import * as schema from '../src/database/schema';

import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { sql } from 'drizzle-orm';
import { readdir } from 'fs/promises';

@Injectable()
export class AppService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
  private getDataPath(fileName: string): string {
    return path.join(process.cwd(), 'data', fileName);
  }

  async importFromFile({
    filePath,
    crop,
    fertilizerType,
  }: {
    filePath: string;
    crop: string;
    fertilizerType: string;
  }) {
    return new Promise<void>((resolve, reject) => {
      const rows: any[] = [];

      fs.createReadStream(this.getDataPath(filePath))
        .pipe(csv())
        .on('data', (data) => {
          rows.push({
            value: parseFloat(data.value),
            region: data.Region,
            zone: data.Zone,
            woreda: data.Woreda,
            kebebe: data.Kebebe,
            lat: parseFloat(data.lat),
            lon: parseFloat(data.lon),
            location: sql`ST_SetSRID(ST_MakePoint(${data.lon}, ${data.lat}), 4326)`,
            crop: crop,
            fertilizerType: fertilizerType,
          });
        })
        .on('end', async () => {
          try {
            // Insert in chunks
            const chunkSize = 500;
            for (let i = 0; i < rows.length; i += chunkSize) {
              const chunk = rows.slice(i, i + chunkSize);
              await this.db.insert(schema.recommendation).values(chunk);
            }
            console.log(`✅ Imported ${rows.length} rows from ${filePath}`);
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .on('error', reject);
    });
  }

  async getFiles(): Promise<string[]> {
    const dirPath = path.join(process.cwd(), 'data'); // absolute path
    const files = await readdir(dirPath);
    return files;
  }
  getCrop(fileName: string): string {
    if (fileName.includes('_maize_')) {
      return 'Maize';
    } else if (fileName.includes('_wheat_')) {
      return 'Wheat';
    }
    return 'Unknown';
  }
  getFertlizerType(fileName: string): string {
    if (fileName.includes('_n_')) {
      return 'N';
    } else if (fileName.includes('_p_')) {
      return 'P';
    } else if (fileName.includes('_nps_')) {
      return 'NPS';
    } else if (fileName.includes('_urea_')) {
      return 'Urea';
    } else if (fileName.includes('_compost_')) {
      return 'Compost';
    } else if (fileName.includes('_vcompost_')) {
      return 'Vcompost';
    } else if (fileName.includes('yieldtypes')) {
      return 'yield';
    }
    return 'Unknown';
  }

  async importAllFromFile() {
    try {
      const files = await this.getFiles();
      for (let file of files) {
        await this.importFromFile({
          filePath: file,
          crop: this.getCrop(file),
          fertilizerType: this.getFertlizerType(file),
        });
      }

      return {
        message: `${files.length} files imported successfully`,
        status: 'Success',
      };
    } catch (err) {
      console.log(err);
      throw new Error('Error while importing data');
    }
  }

  async getRecommendation(lat: number, lon: number) {
    const point = sql`ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)`;

    const result = await this.db.execute(
      sql`
      SELECT *
      FROM (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY fertilizer_type, crop
                 ORDER BY location <-> ${point}  -- nearest first
               ) AS rn
        FROM ${schema.recommendation}
      ) AS ranked
      WHERE rn = 1
    `,
    );
    return result.rows;
  }
}
