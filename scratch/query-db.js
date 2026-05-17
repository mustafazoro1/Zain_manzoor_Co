import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://neondb_owner:npg_SFv4fL5qwrkP@ep-shiny-glitter-alcbh47m-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function test() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to Neon DB!");
  
  const res = await client.query("SELECT key, length(value) as len FROM site_content");
  console.log("ROWS FOUND IN DB:", res.rowCount);
  res.rows.forEach(r => {
    console.log(`- Key: "${r.key}" (Length of value: ${r.len})`);
  });

  const machinery = await client.query("SELECT value FROM site_content WHERE key = 'machinery_items'");
  if (machinery.rowCount > 0) {
    console.log("MACHINERY VALUE:", machinery.rows[0].value);
  } else {
    console.log("NO MACHINERY_ITEMS KEY FOUND IN DB!");
  }
  
  await client.end();
}

test().catch(console.error);
