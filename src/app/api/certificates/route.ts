import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CertificateRecord, INITIAL_CERTIFICATES } from "@/lib/types/certificate-types";

// Helper to check valid UUID
function isValidUUID(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Helper to convert DB row to CertificateRecord
function mapRowToCertificate(row: any): CertificateRecord {
  if (row.qr_payload) {
    try {
      const parsed = JSON.parse(row.qr_payload);
      if (parsed && (parsed.certificateNumber || parsed.code)) {
        return {
          ...parsed,
          id: row.id || parsed.id,
          status: row.status || parsed.status || "APPROVED",
          certificateNumber: row.certificate_code || parsed.certificateNumber,
          title: row.title || parsed.title,
          institution: row.issuer_institution || parsed.institution,
          issuedDate: row.issue_date || parsed.issuedDate,
        };
      }
    } catch {}
  }

  return {
    id: row.id,
    code: row.certificate_code,
    certificateNumber: row.certificate_code,
    studentId: row.user_id,
    studentName: "Verified Scholar",
    institution: row.issuer_institution || "Institute of Health Technology (IHT)",
    program: row.certificate_code?.includes("BSC") ? "BSC" : "DIPLOMA",
    year: "1",
    title: row.title || "Institutional Competency Conferred",
    grade: "Distinction",
    status: row.status || "APPROVED",
    applicationDate: row.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
    issuedDate: row.issue_date || row.created_at?.split("T")[0],
    verificationCode: `VER-${row.certificate_code}`,
  };
}

// Ensure default super admin UUID for foreign key
async function getFallbackUserId(admin: ReturnType<typeof createAdminClient>): Promise<string> {
  try {
    const { data: profiles } = await admin.from("profiles").select("id, role").limit(5);
    if (profiles && profiles.length > 0) {
      const sa = profiles.find((p: any) => p.role === "SUPER_ADMIN");
      return (sa || profiles[0]).id;
    }
  } catch {}
  return "af61edf4-d9d3-4c67-a231-c104316b8410";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("code") || searchParams.get("id");
    const admin = createAdminClient();

    // Query from Supabase certificates table
    const { data: rows, error } = await admin
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching certificates from Supabase:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    let certs: CertificateRecord[] = (rows || []).map(mapRowToCertificate);

    // If table has missing initial seed certificates, seed them automatically
    const existingCodes = new Set(certs.map((c) => (c.certificateNumber || c.code).toUpperCase()));
    const missingSeeds = INITIAL_CERTIFICATES.filter(
      (seed) => !existingCodes.has(seed.certificateNumber.toUpperCase())
    );

    if (missingSeeds.length > 0) {
      const fallbackId = await getFallbackUserId(admin);
      for (const seed of missingSeeds) {
        try {
          await admin.from("certificates").upsert(
            {
              certificate_code: seed.certificateNumber,
              user_id: fallbackId,
              title: seed.title,
              issuer_institution: seed.institution,
              issue_date: seed.issuedDate || seed.applicationDate,
              qr_payload: JSON.stringify(seed),
              status: seed.status,
            },
            { onConflict: "certificate_code" }
          );
          certs.unshift(seed);
        } catch (e) {
          console.error("Auto-seeding error for", seed.certificateNumber, e);
        }
      }
    }

    // Filter if specific query provided
    if (query && query.trim()) {
      const clean = query.trim().toUpperCase();
      const cleanAlphaNum = clean.replace(/[^A-Z0-9]/g, "");

      const matched = certs.find((c) => {
        const cNum = (c.certificateNumber || "").toUpperCase();
        const cCode = (c.code || "").toUpperCase();
        const cVer = (c.verificationCode || "").toUpperCase();
        const cId = (c.id || "").toUpperCase();

        if (cNum === clean || cCode === clean || cVer === clean || cId === clean) {
          return true;
        }

        if (cleanAlphaNum.length >= 4) {
          const aNum = cNum.replace(/[^A-Z0-9]/g, "");
          const aCode = cCode.replace(/[^A-Z0-9]/g, "");
          const aVer = cVer.replace(/[^A-Z0-9]/g, "");
          return aNum === cleanAlphaNum || aCode === cleanAlphaNum || aVer === cleanAlphaNum;
        }
        return false;
      });

      if (matched) {
        return NextResponse.json({ success: true, certificate: matched });
      }

      // Also search initial seeds as fallback
      const fallbackMatch = INITIAL_CERTIFICATES.find((c) => {
        const cNum = c.certificateNumber.toUpperCase();
        const cCode = c.code.toUpperCase();
        const cVer = c.verificationCode.toUpperCase();
        return (
          cNum === clean ||
          cCode === clean ||
          cVer === clean ||
          cNum.replace(/[^A-Z0-9]/g, "") === cleanAlphaNum
        );
      });

      if (fallbackMatch) {
        return NextResponse.json({ success: true, certificate: fallbackMatch });
      }

      return NextResponse.json({ success: false, error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, count: certs.length, certificates: certs });
  } catch (error: any) {
    console.error("Certificates API GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const admin = createAdminClient();
    const fallbackId = await getFallbackUserId(admin);

    const items: CertificateRecord[] = Array.isArray(body) ? body : [body];
    const inserted: CertificateRecord[] = [];

    for (const cert of items) {
      if (!cert.certificateNumber && !cert.code) continue;

      const certCode = (cert.certificateNumber || cert.code).trim().toUpperCase();
      const userId = isValidUUID(cert.studentId) ? cert.studentId : fallbackId;

      const row = {
        certificate_code: certCode,
        user_id: userId,
        title: cert.title || "Academic Competency Benchmark",
        issuer_institution: cert.institution || "LabTutor Central Examination Council",
        issue_date: cert.issuedDate || cert.applicationDate || new Date().toISOString().split("T")[0],
        qr_payload: JSON.stringify(cert),
        status: cert.status || "PENDING",
      };

      const { data, error } = await admin
        .from("certificates")
        .upsert(row, { onConflict: "certificate_code" })
        .select();

      if (error) {
        console.error("Error upserting certificate:", certCode, error);
      } else if (data && data.length > 0) {
        inserted.push(mapRowToCertificate(data[0]));
      } else {
        inserted.push(cert);
      }
    }

    // Broadcast real-time update on Supabase channel
    try {
      const channel = admin.channel("certificates_realtime");
      await channel.send({
        type: "broadcast",
        event: "CERTIFICATES_SYNCED",
        payload: { certificates: inserted, count: inserted.length },
      });
    } catch (bcError) {
      console.warn("Realtime broadcast notice:", bcError);
    }

    return NextResponse.json({
      success: true,
      count: inserted.length,
      certificates: inserted,
    });
  } catch (error: any) {
    console.error("Certificates API POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, certificateNumber, code, status, reviewedBy, reviewedRole, feedback, issuedDate } = body;

    const certCode = (certificateNumber || code || "").trim().toUpperCase();
    if (!certCode && !id) {
      return NextResponse.json(
        { success: false, error: "certificateNumber or id is required" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    let query = admin.from("certificates").select("*");
    if (certCode) {
      query = query.eq("certificate_code", certCode);
    } else if (id) {
      query = query.eq("id", id);
    }

    const { data: existing, error: findError } = await query.maybeSingle();
    if (findError || !existing) {
      return NextResponse.json(
        { success: false, error: "Certificate record not found in central database" },
        { status: 404 }
      );
    }

    let updatedCertRecord: CertificateRecord = mapRowToCertificate(existing);
    updatedCertRecord = {
      ...updatedCertRecord,
      status: status || updatedCertRecord.status,
      reviewedBy: reviewedBy ?? updatedCertRecord.reviewedBy,
      reviewedRole: reviewedRole ?? updatedCertRecord.reviewedRole,
      feedback: feedback ?? updatedCertRecord.feedback,
      issuedDate: status === "APPROVED" ? (issuedDate || new Date().toISOString().split("T")[0]) : updatedCertRecord.issuedDate,
    };

    const updatePayload = {
      status: status || existing.status,
      issue_date: updatedCertRecord.issuedDate || existing.issue_date,
      qr_payload: JSON.stringify(updatedCertRecord),
    };

    const { data: updatedRow, error: updateError } = await admin
      .from("certificates")
      .update(updatePayload)
      .eq("id", existing.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    const finalCert = mapRowToCertificate(updatedRow);

    try {
      const channel = admin.channel("certificates_realtime");
      await channel.send({
        type: "broadcast",
        event: "CERTIFICATES_SYNCED",
        payload: { certificates: [finalCert] },
      });
    } catch {}

    return NextResponse.json({ success: true, certificate: finalCert });
  } catch (error: any) {
    console.error("Certificates API PUT error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
