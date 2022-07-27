const userModel = require("../models/userModel");

// Validataion for empty request body
const checkBodyParams = function (value) {
  if (Object.keys(value).length === 0) return false;
  else return true;
};

const isValidBody = function (value) {
  if (typeof value === "undefined" || value === "null") return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  // if (typeof value === "number" && value.toString().trim().length === 0)
  //   return false;
  return true;
};

const isValidEmail = function (email) {
  let checkemail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  if (checkemail.test(email)) {
    return true;
  }
  return false;
};

const isValidMobileNumber = function (mobile) {
  let checkMobile = /^\s*\+91\s[6-9]\d{9}$/;
  if (checkMobile.test(mobile)) {
    return true;
  }
  return false;
};

const isValidPassword = function (password) {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,15}$/; //for password space not allowed, also handles !password
  return re.test(password);
};

// Validation for length of characters
const lengthOfCharacter = function (value) {
  if (!/^\s*(?=[a-zA-Z])[\a-z\A-Z\s]{3,64}\s*$/.test(value)) return false;
  else return true;
};

// ....................................... Validation for User .................................//
const validationForUser = async function (req, res, next) {
  try {
    let data = req.body;
    const { fname, lname, email, phone, password, address } = data;

    if (!checkBodyParams(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please input Parameters" });
    }
    if (!isValidBody(fname)) {
      return res.status(400).send({
        status: false,
        message: "Please provide first name , eg.Ankita",
      });
    }
    if (!lengthOfCharacter(fname)) {
      return res.status(400).send({
        status: false,
        message: "Please provide first name with right format",
      });
    }

    if (!isValidBody(lname)) {
      return res.status(400).send({
        status: false,
        message: "Please provide last name , eg.Sangani",
      });
    }
    if (!lengthOfCharacter(lname)) {
      return res.status(400).send({
        status: false,
        message: "Please provide last name with right format",
      });
    }

    if (!isValidBody(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter email" });
    } else if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email is not valid" });
    }
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res
        .status(400)
        .send({ status: false, message: "This Email is already in use" });
    }

    if (!phone) {
      return res.status(400).send({
        status: false,
        message: "Please enter mobile number",
      });
    }
    if (!isValidMobileNumber(phone)) {
      return res.status(400).send({
        status: false,
        message: "Please enter 10 digit indian number, eg. +91 9876xxxxxx",
      });
    }
    const existPhone = await userModel.findOne({ phone });
    if (existPhone) {
      return res.status(400).send({
        status: false,
        message: "This Mobile number is already in use",
      });
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Please enter valid password with one uppercase ,lowercse and special character and length should be 8 to 15",
      });
    }
    if (!address.shipping) {
      return res.status(400).send({
        status: false,
        message: "Please enter shipping address",
      });
    }

    if (!isValidBody(address.shipping.street)) {
      return res.status(400).send({
        status: false,
        message: "Please enter street in shipping address",
      });
    }
    if (!isValidBody(address.shipping.city)) {
      return res.status(400).send({
        status: false,
        message: "Please enter city in shipping address",
      });
    }
    if (!lengthOfCharacter(address.shipping.city)) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid city",
      });
    }
    if (!/^\d{6}$/.test(address.shipping.pincode)) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid pincode",
      });
    }

    if (!address.billing) {
      return res.status(400).send({
        status: false,
        message: "Please enter billing address",
      });
    }
    if (!isValidBody(address.billing.street)) {
      return res.status(400).send({
        status: false,
        message: "Please enter street in billing address",
      });
    }
    if (!isValidBody(address.billing.city)) {
      return res.status(400).send({
        status: false,
        message: "Please enter city in billing address",
      });
    }
    if (!lengthOfCharacter(address.billing.city)) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid city",
      });
    }
    if (!/^\d{6}$/.test(address.billing.pincode)) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid pincode",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
  next();
};

// ....................................... Validation for Login User .................................//
const validationForLoginUser = async function (req, res, next) {
  try {
    let data = req.body;

    if (!checkBodyParams(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please input Parameters" });
    }
    if (!data.email) {
      return res.status(400).send({
        status: false,
        message: "Email is mandatory",
      });
    }
    if (!isValidEmail(data.email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email is not valid" });
    }
    if (!data.password) {
      return res.status(400).send({
        status: false,
        message: "Password is mandatory",
      });
    }
    if (!isValidPassword(data.password)) {
      return res.status(400).send({
        status: false,
        message:
          "Please enter valid password with one uppercase ,lowercse and special character and length should be 8 to 15",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
  next();
};

// ....................................... Validation for Updated User .................................//
const validationForUpdateUser = async function (req, res, next) {
  try {
    let userId = req.params.userId;
    const user = await userModel.findById(userId);

    // authorization
    if (req.headers.userId !== user._id.toString()) {
      return res
        .status(403)
        .send({ status: false, msg: "You are not authorized...." });
    }

    let data = req.body;
    const { fname, lname, email, phone, password, address } = data;

    if (!checkBodyParams(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please input Parameters" });
    }

    if (fname != undefined) {
      if (!isValidBody(fname)) {
        return res.status(400).send({
          status: false,
          message: "Please provide first name,eg.Ankita",
        });
      }
      if (!lengthOfCharacter(fname)) {
        return res.status(400).send({
          status: false,
          message: "Please provide first name with right format",
        });
      }
    }

    if (lname != undefined) {
      if (!isValidBody(lname)) {
        return res.status(400).send({
          status: false,
          message: "Please provide last name,eg.Sangani",
        });
      }
      if (!lengthOfCharacter(lname)) {
        return res.status(400).send({
          status: false,
          message: "Please provide last name with right format",
        });
      }
    }

    if (email != undefined)
      if (!isValidBody(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter email" });
      } else if (!isValidEmail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Email is not valid" });
      }

    if (phone != undefined) {
      if (!isValidMobileNumber(phone)) {
        return res.status(400).send({
          status: false,
          message: "Please enter 10 digit indian number, eg. +91 9876xxxxxx",
        });
      }
    }

    if (password != undefined) {
      if (!isValidPassword(password)) {
        return res.status(400).send({
          status: false,
          message:
            "Please enter valid password with one uppercase ,lowercse and special character and length should be 8 to 15",
        });
      }
    }

    if (address && address.shipping) {
      if (
        address.shipping.street != undefined &&
        !isValidBody(address.shipping.street)
      ) {
        return res.status(400).send({
          status: false,
          message: "Please enter street in shipping address",
        });
      }
      if (
        address.shipping.city != undefined &&
        !lengthOfCharacter(address.shipping.city)
      ) {
        return res.status(400).send({
          status: false,
          message: "Please enter city in shipping address with right format",
        });
      }

      if (
        address.shipping.pincode != undefined &&
        !/^\d{6}$/.test(address.shipping.pincode)
      ) {
        return res.status(400).send({
          status: false,
          message: "Please enter pincode in shipping address with right format",
        });
      }
    }

    if (address && address.billing) {
      if (
        address.billing.street != undefined &&
        !isValidBody(address.billing.street)
      ) {
        return res.status(400).send({
          status: false,
          message: "Please enter street in billing address",
        });
      }
      if (
        address.billing.city != undefined &&
        !lengthOfCharacter(address.billing.city)
      ) {
        return res.status(400).send({
          status: false,
          message: "Please enter city in billing address with right format",
        });
      }

      if (
        address.billing.pincode != undefined &&
        !/^\d{6}$/.test(address.billing.pincode)
      ) {
        return res.status(400).send({
          status: false,
          message: "Please enter pincode in billing address with right format",
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
  next();
};

module.exports = {
  validationForUser,
  validationForLoginUser,
  validationForUpdateUser,
};
