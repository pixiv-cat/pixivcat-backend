const Memcached = require('memcached');

const memcached = new Memcached(process.env.MEMCACHED_SERVER || 'localhost:11211');

const generateKey = (key) => `${process.env.MEMCACHED_NAMESPACE}:${key}`;

const get = (key) => new Promise((resolve, reject) => {
  memcached.get(generateKey(key), (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

const set = (key, value, lifetime = 3600) => new Promise((resolve, reject) => {
  memcached.set(generateKey(key), value, lifetime, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

module.exports = {
  get,
  set,
};
