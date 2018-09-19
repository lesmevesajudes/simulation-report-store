
function unauthorized() {
  var err = new Error('unauthorized');
  err.status = 401;
  return err;
}

function badRequest() {
  var err = new Error('Bad Request');
  err.status = 400;
  return err;
}

module.exports = {
  unauthorized: unauthorized,
  badRequest: badRequest
};
