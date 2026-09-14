import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
it("initializes an empty project atomically and refuses to overwrite an existing one", async()=>{
 const db=new PGlite();
 try {
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;
   create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
   create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
   create function auth.role() returns text language sql stable as $$ select current_user::text $$;
   grant usage on schema auth to authenticated,service_role;
   create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);`);
  const sql=readFileSync('supabase/bootstrap-new-project.sql','utf8').replace('create extension if not exists "uuid-ossp";','');
  await db.exec(sql);
  const tables=await db.query("select table_name from information_schema.tables where table_schema='public'");
  expect(tables.rows.map((r:any)=>r.table_name)).toEqual(expect.arrayContaining(['profiles','orders','blueprints','blueprint_assets','waitlist','messages']));
  await expect(db.exec(sql)).rejects.toThrow('WebForm tables already exist');
  await db.exec('rollback');
  expect((await db.query("select count(*)::int as count from storage.buckets where id='webform-private-assets' and public=false")).rows).toEqual([{count:1}]);
 }finally{await db.close();}
},60000);
