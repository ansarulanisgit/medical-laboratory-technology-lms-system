"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const program = searchParams.get("program");

  React.useEffect(() => {
    const target = program
      ? `/?auth=register&program=${encodeURIComponent(program)}`
      : "/?auth=register";
    router.replace(target);
  }, [router, program]);

  return null;
}

export default function RegisterPage() {
  return (
    <React.Suspense fallback={null}>
      <RegisterContent />
    </React.Suspense>
  );
}
