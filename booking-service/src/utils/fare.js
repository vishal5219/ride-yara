exports.calculateFare = (distance, time, surge = 1) => {
  // TODO: Implement fare calculation logic
  return distance * 10 + time * 2 * surge;
}; 