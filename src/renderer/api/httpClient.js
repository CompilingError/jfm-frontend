const API_BASE_URL = 'http://localhost:8080';

export class HttpError extends Error {
  constructor(message, status, responseBody) {
    super(message);

    this.name = 'HttpError';
    this.status = status;
    this.responseBody = responseBody;
  }
}

function buildUrl(path, query = {}) {
  const url = new URL(path, API_BASE_URL);

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        url.searchParams.append(key, item);
      });

      return;
    }

    url.searchParams.set(key, value);
  });

  return url.toString();
}

export async function request(path, options = {}) {
  const {
    method = 'GET',
    query,
    body,
    headers = {},
  } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new HttpError(
      `HTTP request failed: ${response.status}`,
      response.status,
      responseText
    );
  }

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}