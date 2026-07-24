import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { updateEnquiry } from "@/lib/data";
import { enquiryStatusSchema } from "@/lib/validation";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const admin=await requireAdminApi();if(!admin)return NextResponse.json({message:"Unauthorised"},{status:401});const body=await request.json() as {status?:unknown;note?:unknown};const status=enquiryStatusSchema.safeParse(body.status);if(!status.success||typeof body.note!=="string"||body.note.length>3000)return NextResponse.json({message:"Invalid update"},{status:422});const {id}=await params;await updateEnquiry(id,status.data,body.note,admin.id);return NextResponse.json({ok:true});}
