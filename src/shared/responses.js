
function unauthorized() {
  let err = new Error('unauthorized');
  err.status = 401;
  return err;
}

function badRequest() {
  let err = new Error('Bad Request');
  err.status = 400;
  return err;
}

export default {unauthorized, badRequest};
