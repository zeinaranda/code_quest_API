require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Example reasonable file size limit
});

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/user');
var avatarRouter = require('./routes/avatar');
var stageRouter = require('./routes/stage');
var questionRouter = require('./routes/question');
var bossdoneRouter = require('./routes/bossdone');
var ownedRouter = require('./routes/ownedavatar');
var storyRouter = require('./routes/storytelling');
var knowledgedoneRouter = require('./routes/knowledgedone');
var userStageRouter = require('./routes/userstage');
var progressRouter = require('./routes/progress');
var friendRouter = require('./routes/friend');
var forumRouter = require('./routes/forum');






var app = express();

app.use('/images', express.static(path.join(__dirname, 'upload/images')));
app.post("/upload", upload.single('image'), (req, res) => {
    console.log(req.file);
    res.json({
        success: 1,
        profile_url: `https://mr4vffpk-3000.asse.devtunnels.ms/images/${req.file.filename}`
    });
});

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        });
    } else {
        next(err);
    }
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', adminRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/avatar', avatarRouter);
app.use('/stage', stageRouter);
app.use('/question', questionRouter);
app.use('/bossdone', bossdoneRouter);
app.use('/owned', ownedRouter);
app.use('/storytelling', storyRouter);
app.use('/knowledgedone', knowledgedoneRouter);
app.use('/userstage', userStageRouter);
app.use('/progress', progressRouter);
app.use('/friend', friendRouter);
app.use('/forum', forumRouter);






app.use(errHandler);

module.exports = app;
