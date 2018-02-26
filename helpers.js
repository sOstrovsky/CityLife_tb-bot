import axios from 'axios';

export const postQuery = async (link, data) => {
    return await axios.post(link, {'query': data});
};