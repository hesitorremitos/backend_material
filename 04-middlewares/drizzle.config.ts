import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "mysql",
  schema: "./database/schema.js",
  dbCredentials:{
    host: "localhost",
    port: 3306,
    user: 'root',
    //password: '',
    database: '12_septiembre'
  }
});