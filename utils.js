const debounce = (func, delay = 50) => {
  let timeOutId;

  return (...args) => {
    if (timeOutId) {
      clearInterval(timeOutId);
    }

    timeOutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
