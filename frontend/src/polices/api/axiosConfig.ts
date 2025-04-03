import axios from "axios";
import { appUrl } from "../../appurl";

export const api = axios.create({
  baseURL: appUrl,
  withCredentials: true, // Send cookies with requests
});
