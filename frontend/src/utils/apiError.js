/** User-facing message from a failed Axios/API call. */
export function describeApiError(error, fallback) {
  if (!error?.response) {
    return "Cannot reach the FarmFresh API. Start the backend (uvicorn) and confirm VITE_PROXY_TARGET in frontend/.env.";
  }
  const status = error.response.status;
  const detail = error.response.data?.detail;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }
  if (status === 404) {
    return "Orders API not found. Check that the FastAPI backend is running and VITE_PROXY_TARGET points to it (not another app on port 8000).";
  }
  return fallback;
}