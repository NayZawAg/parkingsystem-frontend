export default {
  tokenAuthenticator(params, key, callback) {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', params);
    hmac.update(key);
    const digest = hmac.digest()
    const encryptedSecretKey = Buffer.from(digest).toString('base64');
    callback(encryptedSecretKey)
  }
}
