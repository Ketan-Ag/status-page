import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/server/db";

function generateUniqueSlug(baseSlug: string): string {
  // Remove special characters and convert to lowercase
  const cleanSlug = baseSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  // Add a random string to ensure uniqueness
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${cleanSlug}-${randomString}`;
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    // First create the organization
    const organization = await prisma.organization.create({
      data: {
        name: `${name}'s Organization`,
        slug: email.split("@")[0],
      },
    });

    // Then create the default team
    const team = await prisma.team.create({
      data: {
        name: "Default Team",
        description: "Default team created during signup",
        organizationId: organization.id,
      },
    });

    // Finally create the user and connect them to the team
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        organizationId: organization.id,
        teams: {
          create: {
            teamId: team.id,
            role: "ADMIN",
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 