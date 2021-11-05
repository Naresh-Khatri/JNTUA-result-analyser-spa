
let prefix = window.location.href.includes("8080") ? "http://localhost:3000/" : "https://jntua.plasmatch.in/"
console.log(window.location.href)
module.exports = {
    stats: prefix + "stats/public",
    releasedResults: prefix + "releasedResults",
    resIDDetails: prefix + "resultIDDetails",
    singleResult: prefix + "singleResult",
    singleResultv2: prefix + "singleResultv2",
    batchResults: prefix + "batchResults",
    batchResultsv2: prefix + "batchResultsv2",
    feedback: prefix + "feedback",
    share: prefix + "share",
}