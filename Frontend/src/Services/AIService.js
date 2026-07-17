import axios from "axios";

const API_URL = "http://localhost:8080/api/ai";

export const askAI = async (question) => {
    const response = await axios.post(
        API_URL + "/ask",
        question,
        {
            headers: {
                "Content-Type": "text/plain"
            }
        }
    );

    return response;
};