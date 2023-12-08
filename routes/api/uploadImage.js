const express = require('express');
const path = require('path'); 
const fs = require('fs');
const multer = require('multer')
const ROLES = require('../../config/roles.json');
const allowRoles = require('../../middleware/allowRoles');

const multerDestination = path.join(__dirname, '..', '..', 'static', 'menuItems')
const storage = multer.diskStorage({
    destination: multerDestination,
    filename: function (req, file, cb) {
        if (file.mimetype !== 'image/webp') {
            return cb(new Error("Uploaded image must be of type .webp"), null);
        }
        // console.log("-------")
        // console.log(req.body);
        // console.log("-------")
        // const saveAsName = `${req.body.saveAsName}.webp`;
        const saveAsName = `${Date.now()}.webp`
        cb(null, saveAsName);
    }
})

const upload = multer({ dest: '../../static/menuItems', storage })

const router = express.Router();

router.post(
    '/',
    allowRoles(ROLES.Admin),
    upload.single('menuItemImage'),
    (req, res) => {
        console.log(req.body);
        console.log(req.file);
        const saveAsName = req.body.saveAsName;
        const oldPath = req.file.path;
        const newPath = path.join(req.file.destination, `${saveAsName}.webp`)
        try {
            console.log({oldPath, newPath})
            fs.renameSync(oldPath, newPath);
            res.send("Image uploaded succesfully");
        } catch(err) {
            console.log({err});
            res.send("Couldn't upload file");
        }
    }
)

module.exports = router; 