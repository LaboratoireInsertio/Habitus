const mongojs = require('mongojs');
const _ = require('underscore');
const moment = require('moment');
const db = mongojs('sensors', ['sound_global', 'sound_loud', 'stairs', 'pir', 'photocell_up', 'photocell_down', 'global_activity']);


module.exports.insertData = function(table, data) {
  db[table].insert(data);
}

// Return all data of the DB for the sensors PIR in the entry
module.exports.getGlobalActivity = function(cb) {
  db.global_activity.find(function(err, docs) {
    var datas = _.groupBy(docs, function(doc) {

      // return moment(doc.x).startOf('minute').format();
      return doc;
    });
    cb(docs);
  });
}

// Return all data of the DB for the sensors PIR in the entry
module.exports.getPir = function(cb) {
  db.pir.find(function(err, docs) {
    var datas = _.groupBy(docs, function(doc) {
      return moment(doc.x).startOf('minute').format();
    });
    cb(datas);
  });
}

// Return all data of the DB for the sensors loud sound sensor in the office
module.exports.getSoundLoud = function(cb) {
  db.sound_loud.find(function(err, docs) {
    var datas = _.groupBy(docs, function(doc) {
      return moment(doc.x).startOf('minute').format();
    });
    cb(datas)
  });
}

// Return all data of the DB for the sensors photoCell in the stairs
module.exports.getStairs = function(cb) {
  db.stairs.find(function(err, docs) {
    var datas = _.groupBy(docs, function(doc) {
      return moment(doc.down).startOf('minute').format();
    });
    cb(datas)
  });
}

// Return all data of the DB for the sensors photoCell UP in the stairs
module.exports.getCellUp = function(cb) {
  db.photocell_up.find(function(err, docs) {
    var datas = _.groupBy(docs, function(doc) {
      return moment(doc.x).startOf('minute').format();
    });
    cb(datas)
  });
}

// Return all data of the DB for the sensors photoCell Down in the stairs
module.exports.getCellDown = function(cb) {
  db.photocell_down.find(function(err, docs) {
    var datas = _.groupBy(docs, function(doc) {
      return moment(doc.x).startOf('minute').format();
    });
    cb(datas)
  });
}

// Return all data of the DB for the global sound sensors ine the office
module.exports.getSoundGlobal = function(cb) {
  db.sound_global.find(function(err, docs) {
    var datas = _.groupBy(docs, function(doc) {
      return moment(doc.x).startOf('minute').format();
    });
    cb(datas)
  });
}
