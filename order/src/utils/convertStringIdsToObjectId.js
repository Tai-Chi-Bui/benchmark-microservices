const mongoose = require('mongoose');

/**
 * Recursively converts specified keys in an object or array to `mongoose.Types.ObjectId`.
 * 
 * @param {object | any[]} data - The input object or array to process.
 * @param {string[]} keysToConvert - The keys to convert to `mongoose.Types.ObjectId`.
 * @returns {object | any[]} - The processed object with specified keys converted.
 */
function convertStringIdsToObjectId(
  data,
  keysToConvert = ['productId']
) {
  if (Array.isArray(data)) {
    return data.map(item => convertStringIdsToObjectId(item, keysToConvert));
  } else if (data && typeof data === 'object') {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (keysToConvert.includes(key) && typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)) {
        acc[key] = new mongoose.Types.ObjectId(value);
      } else {
        acc[key] = convertStringIdsToObjectId(value, keysToConvert);
      }
      return acc;
    }, {});
  }
  return data;
}

module.exports = convertStringIdsToObjectId;
