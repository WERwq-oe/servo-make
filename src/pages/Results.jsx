import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { BarChart3, Users, Calendar } from 'lucide-react';

export default function Results() {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Survey Details
                const surveySnap = await getDoc(doc(db, "surveys", id));
                if (surveySnap.exists()) {
                    setSurvey({ id: surveySnap.id, ...surveySnap.data() });
                }

                // Fetch Responses
                const q = query(collection(db, "responses"), where("surveyId", "==", id));
                const querySnapshot = await getDocs(q);
                const resData = querySnapshot.docs.map(doc => doc.data());
                setResponses(resData);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
    if (!survey) return <div className="min-h-screen flex items-center justify-center">Survey not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="container mx-auto max-w-5xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{survey.title}</h1>
                    <div className="flex gap-4 text-slate-500">
                        <div className="flex items-center gap-2"><Users size={18} /> {responses.length} Responses</div>
                        <div className="flex items-center gap-2"><Calendar size={18} /> Created {new Date(survey.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                    </div>
                </header>

                <div className="grid gap-6">
                    {survey.questions.map((q) => (
                        <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">{q.title}</h3>

                            {/* Simple visualization for now - just listing answers */}
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {responses.map((res, idx) => {
                                    const answer = res.answers[q.id];
                                    if (!answer) return <div key={idx} className="text-slate-300 italic">No answer</div>;

                                    if (typeof answer === 'object') {
                                        return (
                                            <div key={idx} className="text-sm text-slate-600 border-b border-slate-50 py-1">
                                                {Object.entries(answer).map(([row, col]) => `${row}: ${col}`).join(', ')}
                                            </div>
                                        )
                                    }

                                    return (
                                        <div key={idx} className="p-2 bg-slate-50 rounded text-slate-700 text-sm">
                                            {String(answer)}
                                        </div>
                                    );
                                })}
                                {responses.length === 0 && <p className="text-slate-400 italic">No responses yet.</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
