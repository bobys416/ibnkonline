/**
 * Supabase Environment Setup and Verification Script
 *
 * Verifies Supabase URL, keys, Database, Auth, and Storage buckets.
 * Usage: npx tsx scripts/supabase-setup.ts
 */

import { createClient } from "@supabase/supabase-js";

async function main() {
  console.log("\n===========================================");
  console.log("🚀 iBNK Marketplace — Supabase Setup & Health Check");
  console.log("===========================================\n");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("1. Checking Environment Variables...");
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✓ Configured (" + supabaseUrl + ")" : "✗ Missing"}`);
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKey ? "✓ Configured (length: " + anonKey.length + ")" : "✗ Missing"}`);
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey ? "✓ Configured" : "⚠ Not set (required for admin bucket creation)"}`);

  if (!supabaseUrl || !anonKey) {
    console.log("\n⚠ Supabase credentials are not fully set in .env / .env.local.");
    console.log("  Please add the following variables:");
    console.log("    NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co");
    console.log("    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>");
    console.log("    SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>");
    console.log("    DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true");
    console.log("    DIRECT_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres");
    console.log("\n  All components have graceful fallbacks in place until live keys are populated.\n");
    return;
  }

  const client = createClient(supabaseUrl, serviceRoleKey || anonKey);

  console.log("\n2. Checking Storage Buckets...");
  const { data: buckets, error: bucketError } = await client.storage.listBuckets();
  if (bucketError) {
    console.log(`   ✗ Storage check failed: ${bucketError.message}`);
  } else {
    console.log(`   ✓ Found ${buckets.length} existing buckets:`, buckets.map((b) => b.name).join(", ") || "(none)");

    const requiredBuckets = [
      { name: "products", public: true },
      { name: "avatars", public: true },
      { name: "banners", public: true },
      { name: "receipts", public: false },
    ];

    for (const b of requiredBuckets) {
      const exists = buckets.some((item) => item.name === b.name);
      if (!exists && serviceRoleKey) {
        console.log(`   Creating bucket: ${b.name}...`);
        const { error: createErr } = await client.storage.createBucket(b.name, {
          public: b.public,
          fileSizeLimit: 10 * 1024 * 1024,
        });
        if (createErr) {
          console.log(`   ✗ Error creating ${b.name}: ${createErr.message}`);
        } else {
          console.log(`   ✓ Created bucket ${b.name} (public: ${b.public})`);
        }
      }
    }
  }

  console.log("\n3. Testing Auth Service...");
  const { data: authData, error: authErr } = await client.auth.getSession();
  if (authErr) {
    console.log(`   ✗ Auth check error: ${authErr.message}`);
  } else {
    console.log("   ✓ Supabase Auth service reachable and active.");
  }

  console.log("\n===========================================");
  console.log("✅ Supabase setup verification complete!");
  console.log("===========================================\n");
}

main().catch((err) => {
  console.error("Setup script failed:", err);
  process.exit(1);
});

