const getAPIUrl = () => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return "http://localhost:2002";
};

const API = getAPIUrl();

if (typeof import.meta !== "undefined" && import.meta.env) {
  console.log("API ENV =", import.meta.env);
}
export default API;
