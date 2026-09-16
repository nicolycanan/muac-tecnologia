import { NextResponse } from "next/server";

import { db } from "../../../src/db";
import { users } from "../../../src/db/schema";

export async function GET() {
  const result = await db.select().from(users);

  return NextResponse.json({
    success: true,
    users: result.length,
  });
}