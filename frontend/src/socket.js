import { io } from "socket.io-client";

export const socket = io("https://collaborative-workflow-orchestration-hjr6.onrender.com");


//local run
// export const socket = io("http://localhost:5000");