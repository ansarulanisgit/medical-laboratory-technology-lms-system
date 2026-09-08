import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Microscope, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-sm">
        <Microscope className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-lg font-semibold text-foreground mb-3">
        Page Not Found
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
        The diagnostic module, curriculum resource, or laboratory page you requested does not exist or has been moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
        </Button>
        <Button asChild className="rounded-xl">
          <Link href="/student">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Student Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
