"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { plateMatrix } from "@/components/records/deck";
import "./admin.css";

export function HiddenAdminEntry() {
  const clicks = useRef<number[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // After the password, the dialog asks for the code mailed to the owner.
  const [sentTo, setSentTo] = useState("");
  const credentials = useRef<{ id: string; password: string } | null>(null);
  // Opened once per mount; a ref callback would reopen it whenever the deck re-renders mid-close.
  useEffect(() => {
    const node = dialog.current;
    if (!open || !node || node.open) return;
    node.showModal();
    node.querySelector<HTMLInputElement>("input")?.focus();
  }, [open]);
  useEffect(() => { if (sentTo) dialog.current?.querySelector<HTMLInputElement>("input[name=code]")?.focus(); }, [sentTo]);
  const router = useRouter();
  async function enter() {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((time) => now - time < 1200), now];
    if (clicks.current.length < 3) return;
    clicks.current = [];
    try {
      const response = await fetch("/api/admin/session", { cache: "no-store" });
      if ((await response.json()).authed) { router.push("/admin"); return; }
    } catch { /* Login remains available when the session check fails. */ }
    setError(""); setSentTo("");
    setOpen(true);
  }
  async function requestCode() {
    if (!credentials.current) { setSentTo(""); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials.current) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSentTo(result.email);
    } catch (error) { setError(error instanceof Error ? error.message : "로그인하지 못했어요"); }
    finally { setBusy(false); }
  }
  return <>
    <g transform={`matrix(${plateMatrix.join(" ")})`}>
      <circle cx="-220" cy="108" r="19" fill="transparent" style={{ pointerEvents: "all", cursor: "default" }} onClick={(event) => { event.stopPropagation(); void enter(); }} />
    </g>
    {open && createPortal(<dialog ref={dialog} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); dialog.current?.close(); } }} className="admin-modal" aria-labelledby="admin-login-title" onClose={() => setOpen(false)} onClick={(event) => { event.stopPropagation(); if (event.target === dialog.current) dialog.current?.close(); }}>
      {!sentTo ? <form key="password" onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        credentials.current = { id: String(data.get("id") ?? ""), password: String(data.get("password") ?? "") };
        await requestCode();
      }}>
        <div className="admin-row"><h2 id="admin-login-title">관리자 로그인</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="닫기">×</button></div>
        <label>아이디<input name="id" autoComplete="username" required autoFocus /></label>
        <label>비밀번호<input name="password" type="password" autoComplete="current-password" required /></label>
        {error && <p role="alert" className="admin-error">{error}</p>}
        <button type="submit" disabled={busy} className="admin-primary">{busy ? "확인 중…" : "다음"}</button>
      </form> : <form key="code" onSubmit={async (event) => {
        event.preventDefault();
        const code = String(new FormData(event.currentTarget).get("code") ?? "").replace(/\D/g, "");
        setBusy(true); setError("");
        try {
          const response = await fetch("/api/admin/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
          const result = await response.json();
          if (!response.ok) { if (response.status === 429) setSentTo(""); throw new Error(result.error); }
          credentials.current = null;
          dialog.current?.close(); router.push("/admin"); router.refresh();
        } catch (error) { setError(error instanceof Error ? error.message : "확인하지 못했어요"); }
        finally { setBusy(false); }
      }}>
        <div className="admin-row"><h2 id="admin-login-title">메일 인증</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="닫기">×</button></div>
        <p className="admin-muted admin-otp-hint">{sentTo}으로 보낸 6자리 코드를 입력하세요. 5분 동안 유효합니다.</p>
        <label>인증 코드<input name="code" className="admin-otp" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required autoFocus /></label>
        {error && <p role="alert" className="admin-error">{error}</p>}
        <button type="submit" disabled={busy} className="admin-primary">{busy ? "확인 중…" : "로그인"}</button>
        <button type="button" className="admin-link-button" disabled={busy} onClick={() => void requestCode()}>코드 다시 보내기</button>
      </form>}
    </dialog>, document.body)}
  </>;
}
