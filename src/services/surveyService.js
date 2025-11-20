import LZString from 'lz-string';
import { collection, addDoc, getDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Save survey to Firestore with user authentication
export const saveSurvey = async (surveyData, userId) => {
    try {
        // Add survey to Firestore
        const docRef = await addDoc(collection(db, 'surveys'), {
            ...surveyData,
            userId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        return docRef.id;
    } catch (error) {
        console.error("Error saving survey:", error);
        throw error;
    }
};

// Get survey by ID (with fallback to compressed format for backwards compatibility)
export const getSurvey = async (id) => {
    try {
        // Try to fetch from Firestore first
        const docRef = doc(db, 'surveys', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }

        // Fallback: try to decode compressed survey (backwards compatibility)
        const decompressed = LZString.decompressFromEncodedURIComponent(id);
        if (!decompressed) throw new Error("Invalid survey ID");
        return JSON.parse(decompressed);
    } catch (error) {
        console.error("Error getting survey:", error);
        throw error;
    }
};

// Submit response to Firestore
export const submitResponse = async (surveyId, answers) => {
    try {
        await addDoc(collection(db, 'responses'), {
            surveyId,
            answers,
            submittedAt: Timestamp.now()
        });
        return true;
    } catch (error) {
        console.error("Error submitting response:", error);
        throw error;
    }
};
