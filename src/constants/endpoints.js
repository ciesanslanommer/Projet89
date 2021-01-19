const ENDPOINT_API_DEV = 'http://localhost:3001';
const ENDPOINT_API_PROD = 'https://projet89-backend.herokuapp.com';

export const ENDPOINT_API = process.env.NODE_ENV === 'production'
    ? ENDPOINT_API_PROD
    : ENDPOINT_API_DEV;
