import { handle } from "hono/vercel";
import { app } from "../src/app.hono";

export default handle(app);
