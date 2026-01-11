const API =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : "http://localhost:2002";

    if (typeof import.meta !== "undefined" && import.meta.env) {
      console.log("API ENV =", import.meta.env);
    }
export default API;
