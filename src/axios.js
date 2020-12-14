import axios from 'axios';

// axios.defaults.baseURL = 'https://infohebackoffice.herokuapp.com';
export const instance = axios.create({
    // baseURL: 'https://infohebackoffice.herokuapp.com' 
    baseURL : 'https://infohebackend.herokuapp.com'
});

// export default {instance};