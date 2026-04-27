const crypto = require("crypto");

const algorithm = "aes-256-ctr";
const secret = process.env.ENCRYPTION_KEY || "mysecretkey";

// 🔐 ENCRYPT
exports.encrypt = (text) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    algorithm,
    crypto.createHash("sha256").update(secret).digest(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final()
  ]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

// 🔓 DECRYPT
exports.decrypt = (hash) => {
  const [ivHex, contentHex] = hash.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const content = Buffer.from(contentHex, "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    crypto.createHash("sha256").update(secret).digest(),
    iv
  );

  const decrypted = Buffer.concat([
    decipher.update(content),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
};