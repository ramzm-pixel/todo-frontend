const API_BASE_URL = "https://todo-backend-xsdf.onrender.com"

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "index.html";
    return;
  } else if (!res.ok) {
    const body = await res.json()
    throw new Error(body.detail);
  }
  return res;
}