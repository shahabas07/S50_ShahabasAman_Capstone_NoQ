import axios from 'axios';
import { useRevalidator } from 'react-router-dom';

export const getId = async (idType) => {
    try {
        const response = await axios.post(
            `https://s50-shahabasaman-capstone-noq.onrender.com/profile/token/getId/${idType}`,
            {},
            { withCredentials: true }
        );
        console.log(response.data);
        
        return { userData: response.data.profileDoc };
    } catch (error) {
        console.error(error);
        return null;
    }
};