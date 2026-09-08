import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      fullName,
      phone,
      institution,
      program,
      academicYear,
      studentIdNumber,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = createAdminClient();

    // 1. Check if user already exists
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    let userId: string;

    if (existing) {
      // Auto-confirm the existing user and update password so they can log in immediately
      await admin.auth.admin.updateUserById(existing.id, {
        email_confirm: true,
        password: password,
      });
      userId = existing.id;
    } else {
      // 2. Create the user directly with email_confirm: true
      const { data: newUser, error: createError } =
        await admin.auth.admin.createUser({
          email: normalizedEmail,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName || normalizedEmail.split("@")[0],
            phone: phone || null,
            role: "STUDENT",
            program: program || "DIPLOMA",
            academic_year: academicYear || "1",
            institution: institution || "Institute of Health Technology (IHT)",
            student_id_number: studentIdNumber || null,
          },
        });

      if (createError) {
        return NextResponse.json(
          { error: createError.message },
          { status: 400 }
        );
      }
      userId = newUser.user.id;
    }

    // 3. Upsert profile in public.profiles
    const role = "STUDENT";
    await admin.from("profiles").upsert(
      {
        id: userId,
        email: normalizedEmail,
        full_name: fullName || normalizedEmail.split("@")[0],
        phone: phone || null,
        role: role,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    // 4. Ensure student_profiles has a row
    const prog = program === "BSC" ? "BSC" : "DIPLOMA";
    const yr = parseInt(academicYear, 10) || 1;

    const { data: existingStudent } = await admin
      .from("student_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existingStudent) {
      await admin.from("student_profiles").insert({
        user_id: userId,
        program_level: prog,
        academic_year: yr,
        enrollment_year: new Date().getFullYear(),
        student_id_number: studentIdNumber || null,
        institution_name: institution || null,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Account created and verified successfully.",
      user: {
        id: userId,
        email: normalizedEmail,
      },
    });
  } catch (error: any) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during registration." },
      { status: 500 }
    );
  }
}
