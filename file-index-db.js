// TODO: Do we need a file lock???

const fs = require('fs');
const editJsonFile = require("edit-json-file");

function dbPath(uid) {
  return '/data/release/weapp/users/' + uid + '.json';
}

function dbEditor (uid) {
  let path = dbPath(uid);
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '[]');
  }

  return editJsonFile(path, {stringify_fn: (k, v) => Array.isArray(v) ? v.filter(e => e) : v});
}

function add (uid, fileName, hash, type){
  let dbFile = dbEditor(uid);

  var index = get(uid, fileName, hash);
  if  (index == -1) {
    index = dbFile.get().length;
  }

  dbFile.set(index.toString(), {name: fileName, hash: hash, type: type});
  dbFile.save();
}

function del (uid, fileName, hash) {
  let dbFile = dbEditor(uid);
  var index = get(uid, fileName, hash);
  if  (index >= 0) {
    dbFile.unset(index.toString());
  }
  dbFile.save();
}

function get (uid, fileName, hash){
  let file = dbEditor(uid).toObject();

  return file.findIndex(e => e.hash === hash);
}

module.exports = {add, del};
