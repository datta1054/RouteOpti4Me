import ProblemInfo from './problemInfo.mongo.js'


function getAllProblemInfos() {
  return ProblemInfo.find()
}

function getProblemInfoById(id) {
  return ProblemInfo.findById(id)
}

function createProblemInfo(file) {
  return ProblemInfo.create({file})
}

async function deleteProblemInfo(id) {
  return ProblemInfo.deleteOne({_id: id})
}

function updateProblemInfo(id, info) {
  return ProblemInfo.updateOne({_id: id}, info)
}

function updateProblemInfoSolution(id, route) {
  return ProblemInfo.updateOne({_id: id}, {
    $push: {
      "solution.routes": route
    }
  })
}

export {
  getAllProblemInfos,
  getProblemInfoById,
  createProblemInfo,
  deleteProblemInfo,
  updateProblemInfo,
  updateProblemInfoSolution,
}
