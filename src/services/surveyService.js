import { db } from '../firebase';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';

export const saveSurvey = async (surveyData) => {
    try {
        const docRef = await addDoc(collection(db, "surveys"), {
            ...surveyData,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving survey: ", error);
        throw error;
    }
};

export const getSurvey = async (id) => {
    try {
        const docRef = doc(db, "surveys", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Survey not found");
        }
    } catch (error) {
        console.error("Error fetching survey: ", error);
        throw error;
    }
};

export const submitResponse = async (surveyId, answers) => {
    try {
        await addDoc(collection(db, "responses"), {
            surveyId,
            answers,
            submittedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error submitting response: ", error);
        throw error;
    }
};
