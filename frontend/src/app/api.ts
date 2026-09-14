/** Where the backend of this repo listens. */
export const BACKEND_URL = 'http://localhost:6080';

/** The OpenVidu deployment, as OpenVidu Local serves it. */
export const OPENVIDU_URL = 'ws://localhost:7880';

/** POSTs a JSON body to the backend and returns the JSON response. */
export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(BACKEND_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}
