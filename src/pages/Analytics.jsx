import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, ArrowLeft, Users, Calendar, TrendingUp, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

export default function Analytics() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [survey, setSurvey] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const analyticsRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) {
                navigate('/login');
                return;
            }

            try {
                // Fetch survey
                const surveySnap = await getDoc(doc(db, 'surveys', id));
                if (!surveySnap.exists()) {
                    navigate('/dashboard');
                    return;
                }

                const surveyData = { id: surveySnap.id, ...surveySnap.data() };

                // Check if user owns this survey
                if (surveyData.userId !== currentUser.uid) {
                    alert('You do not have permission to view these analytics');
                    navigate('/dashboard');
                    return;
                }

                setSurvey(surveyData);

                // Fetch responses
                const q = query(collection(db, 'responses'), where('surveyId', '==', id));
                const querySnapshot = await getDocs(q);
                const responsesData = querySnapshot.docs.map(doc => doc.data());
                setResponses(responsesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, currentUser, navigate]);

    const generateChartData = (question) => {
        if (question.type === 'multiple_choice' || question.type === 'true_false') {
            const counts = {};
            const options = question.type === 'true_false' ? ['True', 'False'] : question.options;

            options.forEach(opt => counts[opt] = 0);

            responses.forEach(res => {
                const answer = res.answers[question.id];
                if (answer && counts.hasOwnProperty(answer)) {
                    counts[answer]++;
                }
            });

            return Object.entries(counts).map(([name, value]) => ({ name, value }));
        }

        if (question.type === 'table') {
            const counts = {};
            question.rows.forEach(row => {
                counts[row] = {};
                question.columns.forEach(col => {
                    counts[row][col] = 0;
                });
            });

            responses.forEach(res => {
                const answer = res.answers[question.id];
                if (answer && typeof answer === 'object') {
                    Object.entries(answer).forEach(([row, col]) => {
                        if (counts[row] && counts[row].hasOwnProperty(col)) {
                            counts[row][col]++;
                        }
                    });
                }
            });

            return Object.entries(counts).flatMap(([row, cols]) =>
                Object.entries(cols).map(([col, count]) => ({
                    name: `${row} - ${col}`,
                    value: count
                }))
            );
        }

        return [];
    };

    const downloadPDF = async () => {
        if (!analyticsRef.current) return;

        setDownloading(true);
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            let yPosition = margin;

            // Title
            pdf.setFontSize(20);
            pdf.setFont(undefined, 'bold');
            pdf.text(survey.title || 'Survey Results', margin, yPosition);
            yPosition += 10;

            // Subtitle
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'normal');
            pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPosition);
            yPosition += 15;

            // Stats
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Statistics', margin, yPosition);
            yPosition += 8;

            pdf.setFontSize(11);
            pdf.setFont(undefined, 'normal');
            pdf.text(`Total Responses: ${responses.length}`, margin, yPosition);
            yPosition += 6;
            pdf.text(`Total Questions: ${survey.questions.length}`, margin, yPosition);
            yPosition += 6;
            pdf.text(`Created: ${survey.createdAt?.seconds ? new Date(survey.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}`, margin, yPosition);
            yPosition += 15;

            // Capture charts
            const charts = analyticsRef.current.querySelectorAll('.chart-container');
            for (let i = 0; i < charts.length; i++) {
                if (yPosition > pageHeight - 80) {
                    pdf.addPage();
                    yPosition = margin;
                }

                const canvas = await html2canvas(charts[i], {
                    scale: 2,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - (margin * 2);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                if (yPosition + imgHeight > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                }

                pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 10;
            }

            pdf.save(`Survey_Analytics_${id}_${Date.now()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!survey) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{survey.title}</h1>
                                <p className="text-sm text-slate-600">Survey Analytics</p>
                            </div>
                        </div>
                        <button
                            onClick={downloadPDF}
                            disabled={downloading}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={18} />
                            {downloading ? 'Generating PDF...' : 'Download PDF'}
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8" ref={analyticsRef}>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Responses</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{responses.length}</p>
                            </div>
                            <Users className="text-blue-600" size={24} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Questions</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{survey.questions.length}</p>
                            </div>
                            <FileText className="text-green-600" size={24} />
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
                                <p className="text-sm font-medium text-slate-600">Avg. Completion</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">100%</p>
                            </div>
                            <TrendingUp className="text-purple-600" size={24} />
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
                                <p className="text-sm font-medium text-slate-600">Created</p>
                                <p className="text-sm font-bold text-slate-900 mt-1">
                                    {survey.createdAt?.seconds ? new Date(survey.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <Calendar className="text-orange-600" size={24} />
                        </div>
                    </motion.div>
                </div>

                {/* Charts */}
                {responses.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <Users className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No responses yet</h3>
                        <p className="text-slate-600">Share your survey to start collecting responses</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {survey.questions.map((question, index) => {
                            const chartData = generateChartData(question);
                            const hasChartData = chartData.length > 0 && chartData.some(d => d.value > 0);

                            return (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 chart-container"
                                >
                                    <h3
                                        className="text-lg font-semibold text-slate-900 mb-6"
                                        dangerouslySetInnerHTML={{ __html: question.title || `Question ${index + 1}` }}
                                    />

                                    {question.type === 'text' || question.type === 'fill_blank' ? (
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            <p className="text-sm font-medium text-slate-600 mb-3">Responses:</p>
                                            {responses.map((res, idx) => {
                                                const answer = res.answers[question.id];
                                                return answer ? (
                                                    <div key={idx} className="p-3 bg-slate-50 rounded-lg text-slate-700">
                                                        {String(answer)}
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    ) : hasChartData ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Bar Chart */}
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 mb-4">Distribution</p>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart data={chartData}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Bar dataKey="value" fill="#6366f1" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            {/* Pie Chart */}
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 mb-4">Percentage</p>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie
                                                            data={chartData}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {chartData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 italic">No responses for this question yet</p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
