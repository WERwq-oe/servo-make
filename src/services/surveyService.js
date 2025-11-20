import LZString from 'lz-string';

// Encode survey data into a URL-safe string
export const saveSurvey = async (surveyData) => {
    try {
        const json = JSON.stringify(surveyData);
        const compressed = LZString.compressToEncodedURIComponent(json);
        return compressed;
    } catch (error) {
        console.error("Error encoding survey:", error);
        throw error;
    }
};

// Decode survey data from the URL string
export const getSurvey = async (id) => {
    try {
        const decompressed = LZString.decompressFromEncodedURIComponent(id);
        if (!decompressed) throw new Error("Invalid survey ID");
        return JSON.parse(decompressed);
    } catch (error) {
        console.error("Error decoding survey:", error);
        throw error;
    }
};

// For a serverless app, we can't "submit" to a DB. 
// We'll simulate success and return the data for the UI to handle (e.g. download/log).
export const submitResponse = async (surveyId, answers) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Response submitted:", { surveyId, answers });
            // In a real serverless setup, you might send this to a Google Sheet or EmailJS
            resolve(true);
        }, 1000);
    });
};
