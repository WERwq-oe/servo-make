import React, { useState } from 'react';
import { useSurvey } from '../hooks/useSurvey';
import QuestionCard from '../components/editor/QuestionCard';
import Toolbar from '../components/editor/Toolbar';
import PreviewModal from '../components/PreviewModal';
import { AnimatePresence, Reorder, motion } from 'framer-motion';
import { Save, Eye } from 'lucide-react';
import { saveSurvey } from '../services/surveyService';

export default function Create() {
    const { survey, addQuestion, updateQuestion, deleteQuestion, updateSurveyDetails, reorderQuestions } = useSurvey();
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishedId, setPublishedId] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const id = await saveSurvey(survey);
            setPublishedId(id);
        } catch (error) {
            alert("Failed to publish survey. Check console for details.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                        <input
                            type="text"
                            value={survey.title}
                            onChange={(e) => updateSurveyDetails({ title: e.target.value })}
                            className="text-lg font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowPreview(true)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
                            <Eye size={18} /> Preview
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPublishing ? 'Publishing...' : <><Save size={18} /> Publish</>}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Editor Area */}
            <main className="container mx-auto px-6 py-12 max-w-3xl relative">
                {publishedId && (
                    <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
                        <div>
                            <p className="font-bold">Survey Ready!</p>
                            <p className="text-sm mt-1 text-emerald-700">Your survey is encoded in the URL below.</p>
                        </div>
                        <div className="flex gap-2">
                            <a href={`#/survey/${publishedId}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-emerald-100 rounded border border-emerald-200 text-sm hover:bg-emerald-200 text-emerald-800">Open</a>
                            <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#/survey/${publishedId}`)} className="px-3 py-1 bg-white rounded border border-emerald-200 text-sm hover:bg-emerald-50">Copy Link</button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <Reorder.Group axis="y" values={survey.questions} onReorder={reorderQuestions} className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {survey.questions.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl"
                                >
                                    <p className="text-slate-400">Start by adding a question from the toolbar</p>
                                </motion.div>
                            ) : (
                                survey.questions.map((q) => (
                                    <QuestionCard
                                        key={q.id}
                                        question={q}
                                        updateQuestion={updateQuestion}
                                        deleteQuestion={deleteQuestion}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </Reorder.Group>
                </div>

                {/* Floating Toolbar */}
                <Toolbar addQuestion={addQuestion} />
            </main>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                survey={survey}
            />
        </div>
    );
}
