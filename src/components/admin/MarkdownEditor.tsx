"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { EditorSelection, EditorState } from "@codemirror/state";
import { EditorView, drawSelection, highlightActiveLine, keymap, placeholder } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

export type EditorHandle = { insert: (text: string, after?: string) => void; replace: (from: string, to: string) => void };
type Props = { value: string; onChange: (value: string) => void; onSave: () => void; onImages: (files: File[]) => void };

// Markdown keeps its marks visible, only quieter, so the text reads like the post it will become.
const markdownStyle = HighlightStyle.define([
  { tag: tags.heading1, fontSize: "1.5em", fontWeight: "700", color: "#f4f6f8" },
  { tag: tags.heading2, fontSize: "1.3em", fontWeight: "700", color: "#f4f6f8" },
  { tag: tags.heading3, fontSize: "1.12em", fontWeight: "650", color: "#f4f6f8" },
  { tag: tags.strong, fontWeight: "700", color: "#ffffff" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  { tag: [tags.link, tags.url], color: "#8fb4ff" },
  { tag: tags.monospace, fontFamily: "var(--font-mono, ui-monospace, monospace)", color: "#ffcf8a" },
  { tag: tags.quote, color: "#b7bec8", fontStyle: "italic" },
  { tag: [tags.processingInstruction, tags.meta, tags.contentSeparator], color: "#6f7782" },
  { tag: tags.list, color: "#9aa3ae" },
  { tag: [tags.keyword, tags.operator], color: "#c792ea" },
  { tag: [tags.string, tags.special(tags.string)], color: "#a5e3a1" },
  { tag: [tags.number, tags.bool, tags.null], color: "#f78c6c" },
  { tag: [tags.comment], color: "#6f7782", fontStyle: "italic" },
  { tag: [tags.function(tags.variableName), tags.typeName, tags.className], color: "#82aaff" },
]);

const theme = EditorView.theme({
  "&": { height: "100%", color: "#dfe3e8", backgroundColor: "transparent", fontSize: "15px" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { fontFamily: "inherit", lineHeight: "1.85", padding: "18px 0 40vh" },
  ".cm-content": { padding: "0 22px", caretColor: "#ffffff", maxWidth: "760px" },
  ".cm-line": { padding: "0" },
  ".cm-cursor": { borderLeftColor: "#ffffff", borderLeftWidth: "2px" },
  ".cm-activeLine": { backgroundColor: "rgb(255 255 255 / 3.5%)" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": { backgroundColor: "rgb(120 160 255 / 28%) !important" },
  ".cm-placeholder": { color: "#6f7782" },
}, { dark: true });

// Wraps the selection in marks, or toggles them off when they are already there.
function wrap(view: EditorView, before: string, after = "") {
  view.dispatch(view.state.changeByRange((range) => {
    const doc = view.state.doc;
    const inner = doc.sliceString(range.from, range.to);
    const outerFrom = range.from - before.length, outerTo = range.to + after.length;
    if (after && outerFrom >= 0 && doc.sliceString(outerFrom, range.from) === before && doc.sliceString(range.to, outerTo) === after) {
      return { changes: [{ from: outerFrom, to: range.from }, { from: range.to, to: outerTo }], range: EditorSelection.range(outerFrom, range.to - before.length) };
    }
    return { changes: { from: range.from, to: range.to, insert: before + inner + after }, range: EditorSelection.range(range.from + before.length, range.from + before.length + inner.length) };
  }));
  view.focus();
}

export const MarkdownEditor = forwardRef<EditorHandle, Props>(function MarkdownEditor({ value, onChange, onSave, onImages }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const latest = useRef({ onChange, onSave, onImages });
  latest.current = { onChange, onSave, onImages };

  useEffect(() => {
    const images = (files: FileList | null | undefined) => Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));
    const editor = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          history(),
          drawSelection(),
          highlightActiveLine(),
          EditorView.lineWrapping,
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          syntaxHighlighting(markdownStyle),
          theme,
          placeholder("## 오늘의 이야기\n\n마크다운으로 글을 써 보세요. 이미지는 붙여넣거나 끌어다 놓으면 올라갑니다."),
          EditorView.contentAttributes.of({ "aria-label": "마크다운 본문", spellcheck: "false" }),
          keymap.of([
            { key: "Mod-b", run: (target) => (wrap(target, "**", "**"), true) },
            { key: "Mod-i", run: (target) => (wrap(target, "*", "*"), true) },
            { key: "Mod-e", run: (target) => (wrap(target, "`", "`"), true) },
            { key: "Mod-k", run: (target) => (wrap(target, "[", "](https://)"), true) },
            { key: "Mod-s", preventDefault: true, run: () => (latest.current.onSave(), true) },
            indentWithTab,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.updateListener.of((update) => { if (update.docChanged) latest.current.onChange(update.state.doc.toString()); }),
          EditorView.domEventHandlers({
            paste: (event) => { const files = images(event.clipboardData?.files); if (!files.length) return false; event.preventDefault(); latest.current.onImages(files); return true; },
            drop: (event, target) => {
              const files = images(event.dataTransfer?.files);
              if (!files.length) return false;
              event.preventDefault();
              const at = target.posAtCoords({ x: event.clientX, y: event.clientY });
              if (at !== null) target.dispatch({ selection: { anchor: at } });
              latest.current.onImages(files);
              return true;
            },
          }),
        ],
      }),
    });
    view.current = editor;
    return () => { editor.destroy(); view.current = null; };
    // The editor owns its document after mount; outside changes arrive through the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restoring a saved copy replaces the whole document.
  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value) editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } });
  }, [value]);

  useImperativeHandle(ref, () => ({
    insert(text, after = "") {
      const editor = view.current;
      if (editor) wrap(editor, text, after);
    },
    replace(from, to) {
      const editor = view.current;
      if (!editor) return;
      const at = editor.state.doc.toString().indexOf(from);
      if (at >= 0) editor.dispatch({ changes: { from: at, to: at + from.length, insert: to } });
    },
  }), []);

  return <div ref={host} className="admin-markdown" />;
});
export default MarkdownEditor;
