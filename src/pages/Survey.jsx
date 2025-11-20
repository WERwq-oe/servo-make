import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSurvey, submitResponse } from '../services/surveyService';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Survey() {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const data = await getSurvey(id);
                setSurvey(data);
            } catch (err) {
                setError("Survey not found or deleted.");
            } finally {
                setLoading(false);
            }
        };
        fetchSurvey();
    }, [id]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitResponse(id, answers);
            setSubmitted(true);
        } catch (err) {
            alert("Failed to submit response. Please try again.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-500 flex-col gap-2"><AlertCircle size={48} /><p>{error}</p></div>;
    if (submitted) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
                <p className="text-slate-600">Your response has been recorded.</p>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">{survey.title}</h1>
                    {survey.description && <p className="text-slate-600 mt-2">{survey.description}</p>}
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {survey.questions.map((q) => (
                        <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3
                                className="text-lg font-medium text-slate-900 mb-4"
                                dangerouslySetInnerHTML={{ __html: q.title + ' <span class="text-red-500">*</span>' }}
                            />

                            {q.type === 'text' && (
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Your answer..."
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                />
                            )}

                            {q.type === 'multiple_choice' && (
                                <div className="space-y-2">
                                    {q.options.map((opt, idx) => (
                                        <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input
                                                type="radio"
                                                name={q.id}
                                                value={opt}
                                                required
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {q.type === 'true_false' && (
                                <div className="flex gap-4">
                                    {['True', 'False'].map((opt) => (
                                        <label key={opt} className="flex-1">
                                            <input
                                                type="radio"
                                                name={q.id}
                                                value={opt}
                                                required
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                className="peer sr-only"
                                            />
                                            <div className="text-center p-3 rounded-lg border border-slate-200 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 cursor-pointer transition-all hover:bg-slate-50 peer-checked:hover:bg-indigo-700">
                                                {opt}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {q.type === 'fill_blank' && (
                                <div className="flex items-baseline gap-2 text-lg text-slate-700 flex-wrap">
                                    <span>The answer is</span>
                                    <input
                                        type="text"
                                        required
                                        className="border-b-2 border-slate-300 focus:border-indigo-600 outline-none px-2 py-1 min-w-[120px]"
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
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
                                                                name={`${q.id}_row_${i}`}
                                                                value={col}
                                                                required
                                                                onChange={(e) => {
                                                                    const currentAnswer = answers[q.id] || {};
                                                                    handleAnswerChange(q.id, { ...currentAnswer, [row]: col });
                                                                }}
                                                                className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 focus:ring-indigo-500"
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
                    ))}

                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1"
                    >
                        Submit Survey
                    </button>
                </form>
            </div>
        </div>
    );
}
