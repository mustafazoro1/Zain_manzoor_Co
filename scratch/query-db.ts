import 'dotenv/config';
import { db } from './lib/db/src/index.ts';
import { siteContentTable } from './lib/db/src/schema/index.ts';

async function test() {
  console.log("Connecting to database...");
  try {
    const rows = await db.select().from(siteContentTable);
    console.log("DATABASE SITE_CONTENT ROWS COUNT:", rows.length);
    console.log("KEYS FOUND IN DB:");
    rows.forEach(r => {
      console.log(`- Key: "${r.key}" (Length of value: ${r.value.length})`);
      if (r.key === 'machinery_items') {
        console.log(`  Value: ${r.value}`);
      }
    });
  } catch (err) {
    console.error("DB QUERY ERROR:", err);
  }
  process.exit(0);
}

test();
