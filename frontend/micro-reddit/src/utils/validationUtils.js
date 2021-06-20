const isValidEmail = (email) => {
  //eslint-disable-next-line
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isErrorObjectNotEmpty = (obj) => {
  if (!obj) {
    return false;
  }

  if (!Object.keys(obj).length) {
    return false;
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
        return true;
      }
    }
  }

  return false;
};

export { isValidEmail, isErrorObjectNotEmpty };
