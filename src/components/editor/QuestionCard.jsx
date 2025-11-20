import React from 'react';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import RichTextEditor from './RichTextEditor';

export default function QuestionCard({ question, updateQuestion, deleteQuestion }) {
    const dragControls = useDragControls();

    const handleTitleChange = (e) => {
        updateQuestion(question.id, { title: e.target.value });
    };

    const addOption = () => {
        updateQuestion(question.id, { options: [...question.options, `Option ${question.options.length + 1}`] });
    };

    const updateOption = (index, value) => {
        const newOptions = [...question.options];
        newOptions[index] = value;
        updateQuestion(question.id, { options: newOptions });
    };

    const removeOption = (index) => {
        const newOptions = question.options.filter((_, i) => i !== index);
        updateQuestion(question.id, { options: newOptions });
    };

    return (
        <Reorder.Item
            value={question}
            id={question.id}
            dragListener={false}
            dragControls={dragControls}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4 group relative hover:shadow-md transition-shadow"
        >
            {/* Drag Handle & Actions */}
            <div
                onPointerDown={(e) => dragControls.start(e)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 group-hover:opacity-100 cursor-move transition-opacity touch-none p-2"
            >
                <GripVertical size={20} />
            </div>

            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => deleteQuestion(question.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Question Header */}
            <div className="mb-6 pl-6 pr-8">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                        {question.type.replace('_', ' ')}
                    </span>
                </div>
                <RichTextEditor
                    value={question.title}
                    onChange={(html) => updateQuestion(question.id, { title: html })}
                    placeholder="Type your question here..."
                />
            </div>

            {/* Question Body based on Type */}
            <div className="pl-6">
                {question.type === 'multiple_choice' && (
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-3 group/option">
                                <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    className="flex-1 text-slate-600 border-b border-transparent focus:border-indigo-300 focus:outline-none bg-transparent py-1"
                                />
                                <button
                                    onClick={() => removeOption(index)}
                                    className="opacity-0 group-hover/option:opacity-100 text-slate-300 hover:text-red-400 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addOption}
                            className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700 mt-2"
                        >
                            <Plus size={16} /> Add Option
                        </button>
                    </div>
                )}

                {question.type === 'text' && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 text-sm italic">
                        Respondents will type their answer here...
                    </div>
                )}

                {question.type === 'true_false' && (
                    <div className="flex gap-4">
                        <div className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500">True</div>
                        <div className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500">False</div>
                    </div>
                )}

                {question.type === 'fill_blank' && (
                    <div className="flex items-end gap-2 text-slate-700">
                        <span>The answer is</span>
                        <div className="border-b-2 border-slate-300 w-32 h-8"></div>
                        <span>.</span>
                    </div>
                )}

                {question.type === 'table' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3"></th>
                                    {question.columns.map((col, i) => (
                                        <th key={i} className="px-4 py-3 text-center">
                                            <input
                                                value={col}
                                                onChange={(e) => {
                                                    const newCols = [...question.columns];
                                                    newCols[i] = e.target.value;
                                                    updateQuestion(question.id, { columns: newCols });
                                                }}
                                                className="bg-transparent border-b border-transparent focus:border-indigo-500 text-center w-full focus:outline-none"
                                            />
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 w-10">
                                        <button
                                            onClick={() => updateQuestion(question.id, { columns: [...question.columns, `Col ${question.columns.length + 1}`] })}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {question.rows.map((row, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            <input
                                                value={row}
                                                onChange={(e) => {
                                                    const newRows = [...question.rows];
                                                    newRows[i] = e.target.value;
                                                    updateQuestion(question.id, { rows: newRows });
                                                }}
                                                className="bg-transparent border-b border-transparent focus:border-indigo-500 w-full focus:outline-none"
                                            />
                                        </td>
                                        {question.columns.map((_, j) => (
                                            <td key={j} className="px-4 py-3 text-center">
                                                <input type="radio" disabled className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300" />
                                            </td>
                                        ))}
                                        <td className="px-4 py-3">
                                            {/* Row delete button could go here */}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => updateQuestion(question.id, { rows: [...question.rows, `Row ${question.rows.length + 1}`] })}
                                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase"
                                        >
                                            <Plus size={14} /> Add Row
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Reorder.Item>
    );
}
