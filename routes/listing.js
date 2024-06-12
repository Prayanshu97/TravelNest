const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

//for parsing multipart data (file) of forms
const multer = require("multer");

//connecting with cloudinary
const {storage} = require("../cloudConfig.js");

// storing in cloudinary
const upload = multer({ storage }); 

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing)); // using multer upload option to upload file

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;