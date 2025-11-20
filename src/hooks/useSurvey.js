import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useSurvey() {
    const [survey, setSurvey] = useState({
        title: 'Untitled Survey',
        description: '',
        questions: [],
    });

    const addQuestion = (type) => {
        const newQuestion = {
            id: uuidv4(),
            type,
            title: '',
            required: false,
            options: type === 'multiple_choice' ? ['Option 1'] : [],
            rows: type === 'table' ? ['Row 1'] : [],
            columns: type === 'table' ? ['Column 1'] : [],
        };

        setSurvey((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
        }));
    };

    const updateQuestion = (id, updates) => {
        setSurvey((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
        }));
    };

    const deleteQuestion = (id) => {
        setSurvey((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q.id !== id),
        }));
    };

    const updateSurveyDetails = (updates) => {
        setSurvey((prev) => ({ ...prev, ...updates }));
    };

    const reorderQuestions = (newQuestions) => {
        setSurvey((prev) => ({ ...prev, questions: newQuestions }));
    };

    return {
        survey,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        updateSurveyDetails,
        reorderQuestions,
    };
}
