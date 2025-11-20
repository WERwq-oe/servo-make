import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder }) {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const applyFormat = (command) => {
        document.execCommand(command, false, null);
        editorRef.current?.focus();
        handleInput();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-1">
                <button
                    type="button"
                    onClick={() => applyFormat('bold')}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    title="Bold (Ctrl+B)"
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => applyFormat('italic')}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    title="Italic (Ctrl+I)"
                >
                    <Italic size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => applyFormat('underline')}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    title="Underline (Ctrl+U)"
                >
                    <Underline size={16} />
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onPaste={handlePaste}
                className="w-full text-lg font-medium text-slate-900 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent py-1 min-h-[32px]"
                data-placeholder={placeholder}
                style={{
                    wordBreak: 'break-word',
                }}
                suppressContentEditableWarning
            />
            <style>{`
                [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #cbd5e1;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
