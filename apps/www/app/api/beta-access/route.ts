import { NextRequest, NextResponse } from "next/server";
import BetaAccessController from "@/controllers/BetaAccessController"; 

export async function POST(req: NextRequest) {
  return await BetaAccessController.createBetaAccess(req);
}

export async function GET(req: NextRequest) {
  return await BetaAccessController.getBetaAccessStatus(req);
}

export async function PUT(req: NextRequest) {
  return await BetaAccessController.updateBetaAccess(req);
}

export async function DELETE(req: NextRequest) {
  return await BetaAccessController.deleteBetaAccess(req);
}
