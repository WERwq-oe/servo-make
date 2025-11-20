import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { PlusCircle, FileText, Users, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { currentUser, userProfile } = useAuth();
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSurveys: 0,
        totalResponses: 0,
        activeSurveys: 0
    });

    useEffect(() => {
        const fetchSurveys = async () => {
            if (!currentUser) return;

            try {
                const q = query(
                    collection(db, 'surveys'),
                    where('userId', '==', currentUser.uid),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const surveysData = await Promise.all(querySnapshot.docs.map(async (doc) => {
                    const surveyData = { id: doc.id, ...doc.data() };

                    // Get response count for each survey
                    const responsesQuery = query(
                        collection(db, 'responses'),
                        where('surveyId', '==', doc.id)
                    );
                    const responsesSnapshot = await getDocs(responsesQuery);
                    surveyData.responseCount = responsesSnapshot.size;

                    return surveyData;
                }));

                setSurveys(surveysData);

                // Calculate stats
                const totalResponses = surveysData.reduce((sum, s) => sum + s.responseCount, 0);
                setStats({
                    totalSurveys: surveysData.length,
                    totalResponses,
                    activeSurveys: surveysData.filter(s => s.responseCount > 0).length
                });
            } catch (error) {
                console.error('Error fetching surveys:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSurveys();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Welcome back, {userProfile?.displayName || 'User'}!
                            </h1>
                            <p className="text-slate-600 mt-1">Manage your surveys and track responses</p>
                        </div>
                        <Link
                            to="/create"
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                        >
                            <PlusCircle size={20} />
                            Create New Survey
                        </Link>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Surveys</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalSurveys}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Responses</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalResponses}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="text-green-600" size={24} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Active Surveys</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeSurveys}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Surveys List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900">Your Surveys</h2>
                    </div>

                    {surveys.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No surveys yet</h3>
                            <p className="text-slate-600 mb-6">Create your first survey to get started</p>
                            <Link
                                to="/create"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                <PlusCircle size={20} />
                                Create Survey
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">
                            {surveys.map((survey, index) => (
                                <motion.div
                                    key={survey.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-6 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                                {survey.title || 'Untitled Survey'}
                                            </h3>
                                            {survey.description && (
                                                <p className="text-slate-600 text-sm mb-3">{survey.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <FileText size={16} />
                                                    {survey.questions?.length || 0} questions
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={16} />
                                                    {survey.responseCount} responses
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    {survey.createdAt?.seconds ? new Date(survey.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 ml-4">
                                            <Link
                                                to={`/analytics/${survey.id}`}
                                                className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors"
                                            >
                                                <BarChart3 size={18} />
                                                Analytics
                                            </Link>
                                            <Link
                                                to={`/survey/${survey.id}`}
                                                target="_blank"
                                                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                            >
                                                View Survey
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
