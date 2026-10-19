/**
 * Validates whether a string has a basic email format.
 * @param {string} email - Email address to validate.
 * @returns {boolean} True if valid, otherwise false.
 */
function isValidEmail(email) {
  if (typeof email !== "string" || email.trim() === "") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

module.exports = { isValidEmail };
