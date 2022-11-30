import { ApiVersions, Endpoints } from './definitions';
import { CanvasClient } from './client';

export async function listAssignmentGroups(
  c: CanvasClient,
  courseId: string,
  options: URLSearchParams
): Promise<any> {
  const response = await c.get(
    `${ApiVersions.v1()}${Endpoints.listAssignmentGroups(courseId)}`,
    options
  );
  const text = await response.text();
  return JSON.parse(text);
}
