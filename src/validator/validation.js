const mongoose = require('mongoose');

//Value Validation
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};


// ObjectId  Validation
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

module.exports.isValid = isValid
module.exports.isValidObjectId = isValidObjectId