import { ApiVersions, Endpoints } from './definitions';
import { CanvasClient } from './client';

export async function listCalendarEvents(
  c: CanvasClient,
  options: URLSearchParams
): Promise<any> {
  const response = await c.get(
    `${ApiVersions.v1()}${Endpoints.listCalendarEvents()}`,
    options
  );
  const text = await response.text();
  return JSON.parse(text);
}

export async function listCalendarEventsForUser(
  c: CanvasClient,
  userId: string,
  options: URLSearchParams
): Promise<any> {
  const response = await c.get(
    `${ApiVersions.v1()}${Endpoints.listCalendarEventsForUser(userId)}`,
    options
  );
  const text = await response.text();
  return JSON.parse(text);
}

export async function getSingleCalendarEventOrAssignment(
  c: CanvasClient,
  id: string
): Promise<any> {
  const response = await c.get(
    `${ApiVersions.v1()}${Endpoints.getSingleCalendarEventOrAssignment(id)}`,
    new URLSearchParams()
  );
  const text = await response.text();
  return JSON.parse(text);
}
