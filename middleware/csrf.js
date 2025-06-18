const csrf= require('host-csrf')

const csrf_options = {
  protected_operations: ["PATCH", "POST"],
  protected_content_types: ["application/json"],
  development_mode: process.env.NODE_ENV !== "production"
}
const csrfMiddleware = csrf(csrf_options);

module.exports =  { csrf, csrfMiddleware }