import { Socket } from "phoenix";

export const getSocket = (token) => { return new Socket("ws://bdf056bb1a03.ngrok.io/socket", { params: { token: token } }).connect() };
