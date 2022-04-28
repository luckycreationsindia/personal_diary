module.exports = {
    secret: "7dca98997701886d7d438558ff6158a6dd7a0f56+@@SX-PkEy-PersonLDryLky",
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucket: process.env.PRODUCT_MANAGER_S3_BUCKET || "personal-diary-test-4d3a765ca6d515c15"
    },
}