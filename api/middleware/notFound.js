

export const notFoundHandler = (req, res, next) => {
  const { method, originalUrl, ip } = req;
  
  console.log(`404 - ${method} ${originalUrl} - IP: ${ip} - ${new Date().toISOString()}`);
  
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

export const errorHandler = (err, req, res, next) => {
  const { method, originalUrl, ip } = req;
  
  console.error(`Error - ${method} ${originalUrl} - IP: ${ip}:`, err);
  
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    error: err.name || "Internal Server Error",
    message: isDev ? err.message : "Something went wrong on our end",
    statusCode: err.status || 500,
    path: originalUrl,
    method: method,
    timestamp: new Date().toISOString(),
    ...(isDev && { stack: err.stack }) 
  });
};
