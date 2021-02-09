import axios from 'axios';

// axios.defaults.baseURL = 'https://infohebackoffice.herokuapp.com';
export const instance = axios.create({
    baseURL: 'https://infohebackend.herokuapp.com' 
    // baseURL : 'http://localhost:4000'
    // baseURL : 'https://infohebackend.herokuapp.com'

});

// export default {instance};