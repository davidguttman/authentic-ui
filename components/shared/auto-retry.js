var xtend = require('xtend')

module.exports = {
  shouldRetryAsSignup: shouldRetryAsSignup,
  shouldRetryAsLogin: shouldRetryAsLogin,
  createRetryDefaults: createRetryDefaults,
  performAutoRetry: performAutoRetry
}

/**
 * Detect if login failed due to user not existing
 * @param {Error} err Error from authentic-client login attempt
 * @returns {boolean} True if should retry as signup
 */
function shouldRetryAsSignup (err) {
  if (!err || !err.message) return false
  
  var message = err.message.toLowerCase()
  
  // Common patterns for "user not found" errors
  var patterns = [
    'user not found',
    'email not found', 
    'account not found',
    'invalid email',
    'no user found',
    'user does not exist',
    'email does not exist',
    'unknown user',
    'unknown email'
  ]
  
  return patterns.some(function (pattern) {
    return message.indexOf(pattern) !== -1
  })
}

/**
 * Detect if signup failed due to user already existing
 * @param {Error} err Error from authentic-client signup attempt
 * @returns {boolean} True if should retry as login
 */
function shouldRetryAsLogin (err) {
  if (!err || !err.message) return false
  
  var message = err.message.toLowerCase()
  
  // Common patterns for "user already exists" errors
  var patterns = [
    'user already exists',
    'email already exists',
    'account already exists', 
    'user exists',
    'email exists',
    'already registered',
    'already signed up',
    'duplicate user',
    'duplicate email'
  ]
  
  return patterns.some(function (pattern) {
    return message.indexOf(pattern) !== -1
  })
}

/**
 * Create default configuration for signup when auto-retrying from login
 * @param {string} baseUrl Base URL for confirm redirect
 * @returns {object} Default signup configuration
 */
function createRetryDefaults (baseUrl) {
  baseUrl = baseUrl || (window.location.origin + window.location.pathname)
  
  return {
    confirmUrl: baseUrl + '#/confirm',
    subject: 'Welcome! Please confirm your account',
    from: null // Will use server default
  }
}

/**
 * Perform auto-retry with proper error handling and user feedback
 * @param {object} options Configuration object
 * @param {function} options.originalMethod Auth method that failed (login/signup)
 * @param {function} options.retryMethod Auth method to retry with
 * @param {object} options.formData User's form input (email, password)
 * @param {object} options.retryData Additional data needed for retry (confirmUrl, subject, etc.)
 * @param {function} options.onRetry Callback when retry begins
 * @param {function} options.onSuccess Callback when retry succeeds
 * @param {function} options.onError Callback when retry fails
 */
function performAutoRetry (options) {
  var retryData = xtend(options.formData, options.retryData)
  
  // Notify that retry is starting
  if (options.onRetry) {
    options.onRetry(options.retryType, retryData)
  }
  
  // Perform the retry
  options.retryMethod(retryData, function (err, result) {
    if (err) {
      return options.onError(err)
    }
    
    options.onSuccess(result, options.retryType)
  })
}