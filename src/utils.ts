export const generateOrderId = () => {
  const now = Date.now().toString();
  return ['NO', now.slice(10, 14)].join('-');
};
