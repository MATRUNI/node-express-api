
export default function whitelist(body = {}, allowedFields = []) {
   return allowedFields.reduce((obj, key) => {
      if (body[key] !== undefined) {
         obj[key] = body[key];
      }
      return obj;
   }, {});
}