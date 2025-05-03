import envConfig from "@/config";
import { io } from "socket.io-client";
import { getAccessTokenFromLocalStorage } from "./utils";
import exp from "constants";

// const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
// auth: {
//   Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
// },
// });
// export default socket;
