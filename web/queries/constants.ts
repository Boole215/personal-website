export const API_URL = process?.env?.DOCKER == "true" ? "http://nginx:3000" : "http://localhost:81";


