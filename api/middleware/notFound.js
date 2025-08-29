/**
 * 404 Not Found Middleware Handler
 * This middleware catches all unmatched routes and returns a standardized 404 response
 * It should be placed after all other routes in the Express app
 */

export const notFoundHandler = (req, res, next) => {
  const { method, originalUrl, ip } = req;
  
  // Log suspicious activity for security monitoring
  console.log(`404 - ${method} ${originalUrl} - IP: ${ip} - ${new Date().toISOString()}`);
  
  // Return standardized 404 response
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "The requested resource could not be found on this server",
    statusCode: 404,
    path: originalUrl,
    method: method,
    timestamp: new Date().toISOString()
  });
};

/**
 * Global Error Handler Middleware
 * Catches any unhandled errors and returns a proper error response
 */
export const errorHandler = (err, req, res, next) => {
  const { method, originalUrl, ip } = req;
  
  // Log the error for debugging
  console.error(`Error - ${method} ${originalUrl} - IP: ${ip}:`, err);
  
  // Don't leak error details in production
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    error: err.name || "Internal Server Error",
    message: isDev ? err.message : "Something went wrong on our end",
    statusCode: err.status || 500,
    path: originalUrl,
    method: method,
    timestamp: new Date().toISOString(),
    ...(isDev && { stack: err.stack }) // Only show stack trace in development
  });
};
