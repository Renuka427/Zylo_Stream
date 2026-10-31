/**
 * Standard API response envelope helpers.
 */

export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const payload = {
    success: true,
    message,
    data
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (res, message = 'Internal Server Error', statusCode = 500, details = null) => {
  const payload = {
    success: false,
    error: {
      message,
      ...(details && { details })
    }
  };

  return res.status(statusCode).json(payload);
};
