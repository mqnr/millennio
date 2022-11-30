import { ApiVersions, Endpoints } from './definitions';
import { CanvasClient } from './client';

export async function listAssignments(
  c: CanvasClient,
  courseId: string,
  options: URLSearchParams
): Promise<any> {
  const response = await c.get(
    `${ApiVersions.v1()}${Endpoints.listAssignments(courseId)}`,
    options
  );
  const text = await response.text();
  return JSON.parse(text);
}
