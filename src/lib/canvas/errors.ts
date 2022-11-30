/* eslint-disable max-classes-per-file */
export class CanvasError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CanvasError);
    }

    this.name = 'CanvasError';
  }
}

export class BadRequestError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestError);
    }

    this.name = 'BadRequestError';
  }
}

export class InvalidAccessTokenError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidAccessTokenError);
    }

    this.name = 'InvalidAccessTokenError';
  }
}

export class UnauthorizedError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError);
    }

    this.name = 'UnauthorizedError';
  }
}

export class ResourceDoesNotExistError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceDoesNotExistError);
    }

    this.name = 'ResourceDoesNotExistError';
  }
}

export class ConflictError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConflictError);
    }

    this.name = 'ConflictError';
  }
}

export class UnprocessableEntityError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnprocessableEntityError);
    }

    this.name = 'UnprocessableEntityError';
  }
}

export class InvalidJsonError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidJsonError);
    }

    this.name = 'InvalidJsonError';
  }
}
