import axios from 'axios';
import { hostingServices } from './config';

export default axios.create({
    baseURL: hostingServices.baseURLApi
});