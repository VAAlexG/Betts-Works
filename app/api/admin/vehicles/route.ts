import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { ensureDatabase } from "@/db/ensure";
import { vehicles } from "@/db/schema";
import { requireAdminApi } from "@/lib/auth";
import { audit } from "@/lib/data";
import { vehicleSchema } from "@/lib/validation";

export async function POST(request:Request){const admin=await requireAdminApi();if(!admin)return NextResponse.json({message:"Unauthorised"},{status:401});let body:unknown;try{body=await request.json()}catch{return NextResponse.json({message:"Invalid request"},{status:400})}const parsed=vehicleSchema.safeParse(body);if(!parsed.success)return NextResponse.json({message:"Please check the vehicle information",errors:parsed.error.flatten().fieldErrors},{status:422});await ensureDatabase();const id=crypto.randomUUID(),now=new Date().toISOString(),data=parsed.data;try{await getDb().insert(vehicles).values({id,...data,variant:data.variant||"",bodyType:data.bodyType||null,fuelType:data.fuelType||null,transmission:data.transmission||null,drivetrain:data.drivetrain||null,priceCents:data.priceCents??null,availabilityStatus:data.published&&data.availabilityStatus==="draft"?"in_stock":data.availabilityStatus,publishedAt:data.published?now:null,createdAt:now,updatedAt:now,conversionProvider:"SCD Direct",isSample:false});await audit(admin.id,"vehicle.created","vehicle",id,{published:data.published});return NextResponse.json({ok:true,id},{status:201});}catch{return NextResponse.json({message:"The slug or stock number may already be in use."},{status:409});}}
