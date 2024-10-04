const { Polly } = require('aws-sdk')

const polly = new Polly({
    accessKeyId:     'AKIAQCP4P2OXVCFHWATC',
    secretAccessKey: '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',
    region:          'ap-southeast-1'
})

module.exports = { polly: polly }