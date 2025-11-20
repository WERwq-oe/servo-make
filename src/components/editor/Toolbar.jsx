import React from 'react';
import { PlusCircle, Type, ListChecks, CheckSquare, Table2, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Toolbar({ addQuestion }) {
    const tools = [
        { type: 'multiple_choice', icon: ListChecks, label: 'Multiple Choice' },
        { type: 'text', icon: AlignLeft, label: 'Text Answer' },
        { type: 'true_false', icon: CheckSquare, label: 'True / False' },
        { type: 'fill_blank', icon: Type, label: 'Fill Blank' },
        { type: 'table', icon: Table2, label: 'Table Grid' },
    ];

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed right-8 top-1/2 -translate-y-1/2 bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-2"
        >
            {tools.map((tool) => (
                <button
                    key={tool.type}
                    onClick={() => addQuestion(tool.type)}
                    className="group relative p-3 rounded-xl hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    <tool.icon size={24} />

                    {/* Tooltip */}
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                        {tool.label}
                    </span>
                </button>
            ))}
        </motion.div>
    );
}
