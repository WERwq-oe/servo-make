import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PreviewModal({ isOpen, onClose, survey }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Preview Survey</h2>
                            <p className="text-sm text-slate-500 mt-1">This is how respondents will see your survey</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                        <div className="max-w-2xl mx-auto">
                            {/* Survey Header */}
                            <header className="mb-8 text-center">
                                <h1 className="text-3xl font-bold text-slate-900">{survey.title || 'Untitled Survey'}</h1>
                                {survey.description && <p className="text-slate-600 mt-2">{survey.description}</p>}
                            </header>

                            {/* Questions */}
                            <div className="space-y-6">
                                {survey.questions.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400">
                                        No questions added yet
                                    </div>
                                ) : (
                                    survey.questions.map((q, index) => (
                                        <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                            <h3
                                                className="text-lg font-medium text-slate-900 mb-4"
                                                dangerouslySetInnerHTML={{ __html: q.title || 'Untitled Question' }}
                                            />

                                            {q.type === 'text' && (
                                                <input
                                                    type="text"
                                                    disabled
                                                    className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50"
                                                    placeholder="Your answer..."
                                                />
                                            )}

                                            {q.type === 'multiple_choice' && (
                                                <div className="space-y-2">
                                                    {q.options.map((opt, idx) => (
                                                        <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                                                            <input
                                                                type="radio"
                                                                disabled
                                                                className="w-4 h-4 text-indigo-600 border-slate-300"
                                                            />
                                                            <span className="text-slate-700">{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {q.type === 'true_false' && (
                                                <div className="flex gap-4">
                                                    {['True', 'False'].map((opt) => (
                                                        <div key={opt} className="flex-1 text-center p-3 rounded-lg border border-slate-200 bg-slate-50">
                                                            {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {q.type === 'fill_blank' && (
                                                <div className="flex items-baseline gap-2 text-lg text-slate-700 flex-wrap">
                                                    <span>The answer is</span>
                                                    <input
                                                        type="text"
                                                        disabled
                                                        className="border-b-2 border-slate-300 px-2 py-1 min-w-[120px] bg-slate-50"
                                                    />
                                                    <span>.</span>
                                                </div>
                                            )}

                                            {q.type === 'table' && (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left text-slate-500">
                                                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                                            <tr>
                                                                <th className="px-4 py-3"></th>
                                                                {q.columns.map((col, i) => (
                                                                    <th key={i} className="px-4 py-3 text-center">{col}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {q.rows.map((row, i) => (
                                                                <tr key={i} className="border-b border-slate-100">
                                                                    <td className="px-4 py-3 font-medium text-slate-900">{row}</td>
                                                                    {q.columns.map((col, j) => (
                                                                        <td key={j} className="px-4 py-3 text-center">
                                                                            <input
                                                                                type="radio"
                                                                                disabled
                                                                                className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300"
                                                                            />
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Submit Button Preview */}
                            {survey.questions.length > 0 && (
                                <button
                                    disabled
                                    className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg opacity-75 cursor-not-allowed"
                                >
                                    Submit Survey
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
