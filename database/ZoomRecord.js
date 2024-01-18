const collectionName = 'slimeRecords'; // Change this to your collection name

/********************************/
/********************************/

const mongoose = require('mongoose')
const { Schema, model } = mongoose

const zoomrecordSchema = new Schema({
  zoomId: String,
  zoomedAt: Date, // Time the zoom happened at
  zoomer: String // memberId of the person who zoomed
})

const ZoomRecord = model('ZoomRecord', zoomrecordSchema)

module.exports = {
  ZoomRecord
}