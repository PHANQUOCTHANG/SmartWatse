export interface IGlobalError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  details?: string[];
}
