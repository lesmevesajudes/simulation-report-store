
export function unauthorized() {
  let err = new Error('unauthorized');
  err.status = 401;
  return err;
}

export function badRequest() {
  let err = new Error('Bad Request');
  err.status = 400;
  return err;
}
