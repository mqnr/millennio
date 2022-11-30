import fetch from 'node-fetch';
import { FormDataEncoder } from 'form-data-encoder';
import { Readable } from 'stream';
import { FormData } from 'formdata-node';
import * as log from '../../util/logging';
import { ApiVersions, Endpoints } from './definitions';
import { CanvasClient } from './client';

export async function submitAssignment(
  c: CanvasClient,
  courseId: string,
  assignmentId: string,
  options: FormData
): Promise<void> {
  if (!options.has('submission[submission_type]')) {
    throw new Error("Didn't pass required option submission[submission_type]");
  }

  const response = await c.post(
    `${ApiVersions.v1()}${Endpoints.submitAssignment(courseId, assignmentId)}`,
    options
  );
}

export async function uploadFileForSubmission(
  c: CanvasClient,
  courseId: string,
  assignmentId: string,
  userId: string,
  options: FormData
): Promise<any> {
  if (!options.has('url')) {
    throw new Error("Direct file uploading isn't currently supported.");
  }

  const response = await c.post(
    `${ApiVersions.v1()}${Endpoints.uploadFileForSubmission(
      courseId,
      assignmentId,
      userId
    )}`,
    options
  );

  const parsed = JSON.parse(await response.text());
  if (!parsed.hasOwnProperty('upload_url')) {
    return parsed;
  }

  const formData = new FormData();

  for (const property in parsed.upload_params) {
    formData.append(property, parsed.upload_params[property]);
  }

  const encoder = new FormDataEncoder(formData);
  const uploadResponse = await fetch(parsed.upload_url, {
    method: 'POST',
    headers: encoder.headers,
    body: Readable.from(encoder),
  });

  if (uploadResponse.status !== 201) {
    throw new Error(`File upload failed: ${await uploadResponse.text()}`);
  } else {
    log.debug('---------------');
    log.debug(uploadResponse);
    log.debug('---------------');
    return uploadResponse.text();
  }
}
