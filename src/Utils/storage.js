export const getStorage = (key, defaultValue = null) => {
  const data = localStorage.getItem(key);

  if (!data) {
    return defaultValue;
  }

  return JSON.parse(data);
};

export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorage = (key) => {
  localStorage.removeItem(key);
};