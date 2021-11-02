
let prefix = process.env.NODE_ENV ? "http://localhost:3000/" : "https://jntua.plasmatch.in/"
module.exports = {
    stats: prefix + "stats/public",
    releasedResults: prefix + "releasedResults",
    resIDDetails: prefix + "resultIDDetails",
    semResults: prefix + "semResults",
    singleResult: prefix + "singleResult",
    feedback: prefix + "feedback",
    share: prefix + "share",
}