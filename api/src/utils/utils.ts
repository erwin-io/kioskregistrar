/* eslint-disable @typescript-eslint/no-var-requires */
import { getConnectionOptions, getConnection, Between, ILike } from "typeorm";
import * as bcrypt from "bcrypt";
import { createCipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import moment from "moment";

export const round = (number) => {
  return Math.round((number + Number.EPSILON) * 100);
};

export const AESEncrypt = async (value) => {
  // crypto module
  const crypto = require("crypto");

  const algorithm = "aes-256-cbc";

  // generate 16 bytes of data
  const initVector = crypto
    .createHash("sha512")
    .update(
      fs.readFileSync(path.join(__dirname, "./../../private.key"))
    )
    .digest("hex")
    .substring(0, 16);

  // secret key generate 32 bytes of data
  const Securitykey = crypto
    .createHash("sha512")
    .update(
      fs.readFileSync(path.join(__dirname, "./../../private.key"))
    )
    .digest("hex")
    .substring(0, 32);

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  return Buffer.from(
    cipher.update(value, "utf8", "hex") + cipher.final("hex")
  ).toString("base64"); // Encrypts data and converts to hex and base64
};

export const AESDecrypt = async (value) => {
  // crypto module
  const crypto = require("crypto");

  const algorithm = "aes-256-cbc";

  // generate 16 bytes of data
  const initVector = crypto
    .createHash("sha512")
    .update(
      fs.readFileSync(path.join(__dirname, "./../../private.key"))
    )
    .digest("hex")
    .substring(0, 16);

  // secret key generate 32 bytes of data
  const Securitykey = crypto
    .createHash("sha512")
    .update(
      fs.readFileSync(path.join(__dirname, "./../../private.key"))
    )
    .digest("hex")
    .substring(0, 32);

  const buff = Buffer.from(value, "base64");
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  ); // Decrypts data and converts to utf8
};


export const hash = async (value) => {
  return await bcrypt.hash(value, 10);
};

export const compare = async (newValue, hashedValue) => {
  return await bcrypt.compare(hashedValue, newValue);
};

export const convertColumnNotationToObject = (notation, nestedValue) => {
  let object = {}
  let pointer = object;
  notation.split('.').map( (key, index, arr) => {
    pointer = (pointer[key] = (index == arr.length - 1? nestedValue: {}))
  });
  return object;
}

export const getFullName = (firstName: string, middleName:string = "", lastName: string) => {
  if(middleName && middleName!== "") {
    return `${firstName} ${middleName} ${lastName}`;
  } else {
    return `${firstName} ${lastName}`;
  }
}

export const columnDefToTypeORMCondition = (columnDef) => {

  let conditionMapping = [];
  for(var col of columnDef) {
    if(col.type === "date") {
      if(moment(new Date(col.filter), "MMM DD, YYYY", true).isValid() || moment(new Date(col.filter), "MMMM DD, YYYY", true).isValid() || moment(new Date(col.filter), "YYYY-MM-DD", true).isValid()) {
        conditionMapping.push(convertColumnNotationToObject(col.apiNotation, moment(new Date(col.filter), "YYYY-MM-DD")))
      }
    } else if(col.type === "date-range") {
      let range: any[] = col.filter && col.filter.split(",").length > 0 ? col.filter.split(",").filter(x=>x)  : [];
      range[1] = range.length === 1 ? range[0] : range[1];
      if(moment(new Date(range[0]), "YYYY-MM-DD", true).isValid() && moment(new Date(range[1]), "YYYY-MM-DD", true).isValid()) {
          conditionMapping.push(convertColumnNotationToObject(col.apiNotation, Between(range[0],range[1])))
      }
    } else if(col.type === "option-yes-no") {
      if(col.filter && col.filter !== "" && (["yes", "no"].some(x=>x.toString().toLowerCase() === col.filter.toString().toLowerCase().trim()))) {
        const value = col.filter.toString().toLowerCase().trim() === "yes";
        conditionMapping.push(convertColumnNotationToObject(col.apiNotation, value))
      }
    } else {
      conditionMapping.push(convertColumnNotationToObject(col.apiNotation, ILike(("%"+col.filter+"%"))))
    }
  }
  return Object.assign({}, ...conditionMapping);
}