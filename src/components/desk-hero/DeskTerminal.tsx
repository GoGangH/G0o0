"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import Terminal from "@/components/Terminal";

export function DeskTerminal({ onClose }: { onClose: () => void }) {
  return <Dialog open onClose={onClose} className="relative z-50">
    <DialogBackdrop className="fixed inset-0 bg-[var(--overlay)]" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel className="flex h-[min(80svh,640px)] w-full max-w-3xl flex-col overflow-hidden border border-rule rounded-lg bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-rule bg-background px-4 py-2.5">
          <DialogTitle className="font-mono text-sm font-semibold text-foreground">ganghyun@portfolio ~</DialogTitle>
          <button type="button" onClick={onClose} className="site-link px-2 py-1 text-sm text-muted">닫기</button>
        </div>
        <div className="min-h-0 flex-1"><Terminal /></div>
      </DialogPanel>
    </div>
  </Dialog>;
}
