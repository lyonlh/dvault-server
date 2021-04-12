const express = require('express');
const formidable = require('formidable');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const xfer = require('./ipfs-trans');
const db = require('./file-index-db');

const app = express();
const appRoot = '/data/release/weapp/';
const usersDir = appRoot + 'users/';

// Create ipfs node.
xfer.start();

// Sync the file infos.
app.get('/user/:id', function (req, res) {
  console.log(`GET request reached from user: ${req.params.id}`);

  var id = req.params.id;
  if (!id.trim()) {
    console.error('User id is empty.');
    return;
  }

  var userDbFile = usersDir + id + '.json';

  try {
    if (!fs.existsSync(userDbFile)) {
      fs.writeFileSync(userDbFile, '[]');
    }
  } catch (err) {
    console.error(err);
  }
  res.download(userDbFile, function (err) {
    console.log(err);
  });
});
//app.use((request, response, next) => {
//    response.write('[{"name": "File1", "hash": "sldkusa9983"}, {"name": "File2", "hash": "sldkusa9983"}, {"name": "File3", "hash": "sldkusa9983"}]');
//    response.end();
//});

//app.post('/upload', function(req, res) {
//   if (!req.files)
//      return res.status(400).send('No files were uploaded.');

   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//       let sampleFile = req.files.file;
//       console.log('Upload file: ' + sampleFile.name);
//       return res.status(200).send('OK');
   //       // Use the mv() method to place the file somewhere on your server
   //          sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
   //             if (err)
   //                   return res.status(500).send(err);
   //
   //                      res.send('File uploaded!');
//                         });

onUpload = async (uid, path, name, type) => {
  var hash = await xfer.upload(path);
  // Update file index DB.
  db.add(uid, name, hash, type);
  return hash;
};

// Upload file.
app.post('/user/:id/upload/:name', (req, res) => {
  console.log(`User ${req.params.id} uploading ${req.params.name}.`);
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    for (const file of Object.entries(files)) {
      console.log(file);
    }
    console.log('Fields', fields);
    console.log('Files', files);

    if (err) {
      console.error('Error', err);
      res.status(400).send(err);
    } else {
      let path = files[req.params.name].path;
      onUpload(req.params.id,
               path,
               req.params.name, fields.type).then(hash =>
                                     {res.status(200).json({name: req.params.name, hash: hash, type: fields.type});});
    }
  });
});

// Download file.
app.get('/user/:id/download/:hash', (req, res) => {
  console.log(`User ${req.params.id} downloading ${req.params.hash}.`);
  xfer.download(req.params.hash).then(file => {res.download(file);});
});

// Delete file.
app.post('/user/:id/del/:hash', (req, res) => {
  console.log(`User ${req.params.id} deleting ${req.params.hash}.`);
  xfer.unpin(req.params.hash);
  db.del(req.params.id, '', req.params.hash);
  res.status(200).send('OK');
});

// 监听端口，等待连接
const port = 8765;
app.listen(port);

// 输出服务器启动日志
console.log(`Server listening at http://127.0.0.1:${port}`);
