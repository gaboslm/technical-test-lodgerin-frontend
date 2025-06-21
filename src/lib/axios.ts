import axios from "axios";

const version = "v1";

axios.defaults.baseURL = import.meta.env.VITE_API_URL + `/api/${version}`;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

export default axios;
