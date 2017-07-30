function checkIfHasRole(roles, role) {
  const result = roles.find(item => item === role);
  return result !== undefined;
}

module.exports = {
  checkIfHasRole
};
