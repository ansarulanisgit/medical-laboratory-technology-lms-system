"use client";

import * as React from "react";
import QRCode from "qrcode";
import { QrCode as QrCodeIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QRCodeViewProps {
  value: string;
  size?: number;
  className?: string;
  colorDark?: string;
  colorLight?: string;
  alt?: string;
  showCaption?: boolean;
}

export function QRCodeView({
  value,
  size = 120,
  className,
  colorDark = "#0f172a",
  colorLight = "#ffffff",
  alt = "QR Code",
  showCaption = false,
}: QRCodeViewProps) {
  const [dataUrl, setDataUrl] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    let isMounted = true;
    if (!value) {
      setDataUrl("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    QRCode.toDataURL(value, {
      width: size * 2, // 2x resolution for crisp high-DPI rendering and print
      margin: 1,
      color: {
        dark: colorDark,
        light: colorLight,
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to generate QR code", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, colorDark, colorLight]);

  if (error || (!loading && !dataUrl)) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-2 rounded-lg border border-border bg-muted/40 text-muted-foreground text-center",
          className
        )}
        style={{ width: size, height: size }}
      >
        <QrCodeIcon className="h-6 w-6 opacity-60" />
        <span className="text-[9px] font-mono mt-1">QR Error</span>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <div
        className="relative flex items-center justify-center bg-white rounded-lg p-1 shadow-2xs border border-slate-200/80 overflow-hidden"
        style={{ width: size, height: size }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {dataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={alt}
            width={size}
            height={size}
            className="w-full h-full object-contain"
          />
        )}
      </div>
      {showCaption && (
        <span className="text-[10px] font-mono text-muted-foreground mt-1 text-center">
          Scan to verify
        </span>
      )}
    </div>
  );
}
