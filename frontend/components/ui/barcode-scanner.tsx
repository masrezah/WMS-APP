"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { ScanLine, XCircle } from "lucide-react";

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
  title?: string;
}

export function BarcodeScanner({ onScanSuccess, onScanFailure, title = "Scan Barcode" }: BarcodeScannerProps) {
  const scannerRegionId = "html5qr-code-full-region";
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!isScanning) return;

    // Parameter konfigurasi untuk HTML5-QRCode
    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerRegionId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        rememberLastUsedCamera: true
      },
      false
    );

    scannerRef.current = html5QrcodeScanner;

    html5QrcodeScanner.render(
      (decodedText) => {
        // Otomatis pause/stop saat berhasil menemukan barcode supaya tidak double-scan
        if (scannerRef.current) {
          scannerRef.current.pause(true);
        }
        onScanSuccess(decodedText);
      },
      (error) => {
        if (onScanFailure) {
          onScanFailure(error);
        }
      }
    );

    // CLEANUP FUNGSI: Wajib ada untuk mematikan kamera saat unmount (Mencegah Memory Leak)
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Gagal membersihkan memori html5QrcodeScanner: ", error);
        });
        scannerRef.current = null;
      }
    };
  }, [isScanning, onScanSuccess, onScanFailure]);

  return (
    <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-4 w-full max-w-md mx-auto shadow-sm">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-zinc-100">
          <ScanLine className="w-5 h-5 text-blue-600" />
          {title}
        </h3>
        
        {isScanning && (
          <button 
            type="button"
            onClick={() => setIsScanning(false)}
            className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <XCircle className="w-5 h-5" />
            Tutup Kamera
          </button>
        )}
      </div>

      {isScanning ? (
        <div className="w-full relative overflow-hidden rounded-lg bg-black">
          {/* Injector Container: id harus sama dengan parameter Html5QrcodeScanner */}
          <div id={scannerRegionId} className="w-full min-h-[300px] border-none text-white [&_#html5qr-code-full-region__scan_region]:min-h-[300px]"></div>
        </div>
      ) : (
        <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg">
          <BarcodeIcon className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mb-4" />
          <button
            type="button"
            onClick={() => setIsScanning(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-colors font-medium flex items-center gap-2"
          >
            <ScanLine className="w-4 h-4" /> Mulai Scan Barcode
          </button>
          <p className="mt-4 text-xs text-zinc-500 text-center px-6">
            Posisikan kamera HP pada Barcode / QR Code Produk. Pastikan Anda telah memberi izin akses Kamera di Browser.
          </p>
        </div>
      )}
    </div>
  );
}

// Fallback Icon
function BarcodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5v14" />
      <path d="M8 5v14" />
      <path d="M12 5v14" />
      <path d="M17 5v14" />
      <path d="M21 5v14" />
    </svg>
  );
}
