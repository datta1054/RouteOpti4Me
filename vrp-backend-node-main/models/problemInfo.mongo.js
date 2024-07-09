import mongoose from 'mongoose'

const problemInfoSchema = new mongoose.Schema({
  // https://mongoosejs.com/docs/guide.html#_id
  name: String,
  dimension: Number,
  vehicles: Number,
  optimalValue: Number,
  capacity: Number,
  depotNode: Number,
  nodeData: [
    {
      node: Number,
      latitude: Number,
      longitude: Number,
      demand: Number,
      priority: Number,
    }
  ],
  solution: {
    routes: [
      {
        _id: String,
        tour: [Number], 
        tourDistance: Number 
      }
    ],
    totalDistance: Number
  },
  demandType: [
    {
      node: Number,
      items: [String],
      quantity: [Number]
    }
  ],
  file: {
    type: Buffer,
    // contentType: String,
    required: true,
  }
}, { collection: 'problemInfos'})

// Connects problemInfoSchema with the "problemInfos" collection and __typename problemInfo
export default mongoose.model('problemInfo', problemInfoSchema);
