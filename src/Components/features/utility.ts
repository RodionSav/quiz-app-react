const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getFromLocalStorage = async (key: string) => {
  await delay(500);
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};

export const saveToLocalStorage = async (key: string, data: any) => {
  await delay(500);
  localStorage.setItem(key, JSON.stringify(data));
};
