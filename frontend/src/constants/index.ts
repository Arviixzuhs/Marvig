import { ServerMode } from "@/api/interfaces"
export const ENV = import.meta.env

export const serverMode: ServerMode = ENV['VITE_SERVER_MODE']
