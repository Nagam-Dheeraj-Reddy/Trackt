const calculateStatus = (expiryDate) => {
  const today = new Date();
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { status: 'Expired', color: 'red' };
  if (diffDays <= 30) return { status: 'Expiring Soon', color: 'orange' };
  return { status: 'Active', color: 'green' };
};

module.exports = calculateStatus;