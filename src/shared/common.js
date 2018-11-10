export const getTokenFromRequest = (request) => request.get('Authentication-Token');
export const hasAll = (obj, props) => props.every(prop => obj.hasOwnProperty(prop));
