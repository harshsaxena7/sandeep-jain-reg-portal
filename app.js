require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
require("./passport-setup");
const cookieSession = require("cookie-session");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const nodemailer = require("nodemailer")
const utility = require("./mailer");

// var session = require("express-session")

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://harsh_saxena7:wewereonabreak@register-details.rtwlsuo.mongodb.net/test")
// app.use(passport.initialize());
// app.use(passport.session());
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}))

app.get('/', (req, res) => {
    res.render("pages/index")
})

app.get('/failed', (req, res) => {
    res.send("failed to login")
})

app.get('/success', (req, res) => {
    res.render("pages/profile");
})
app.get('/good/:id', async (req, res) => {
    User.findOne({ _id: req.params.id });
    let user = await User.findOne({ _id: req.params.id });
    res.render("pages/good.ejs", {
        newUser: user

    });

})

app.get('/google', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}));



app.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/failed' }), function (req, res) {
    res.render('pages/profile', {
        newUser: req.user
    });
});
app.post("/profile", function (req, res) {
    // var rollnumber = req.body.rollnumber;
    // var studentno = req.body.studentno;
    // var branch = req.body.branch;
    // var f = { rollnumber: rollnumber, studentno: studentno, branch: branch };
    // User.create(f, function (err, newlyCreatedForm) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.redirect("/payment");
    //     }
    // });

    let whereClause = { _id: req.body._id };
    let updatedField = {
        $set: {
            rollnumber: req.body.rollnumber,
            studentno: req.body.studentno,
            branch: req.body.branch
        }
    };
    console.log("whereClause", whereClause);
    console.log("updatedField", updatedField);

    User.updateOne(whereClause, updatedField, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            console.log(" Profile updated");
            res.redirect("/payment/" + req.body._id);
        }
    });
});

app.get('/payment/:id', (req, res) => {
    console.log("payment req.params.id", req.params.id)
    res.render("pages/payment.ejs", {
        id: req.params.id
    })


})


app.get('/good/:id', (req, res) => {
    const orderId = req.body.razorpay_order_id
    let whereClause = { _id: req.body._id };
    let updatedField = {
        $set: {
            "orderId": orderId
        }
    };
    console.log("whereClause", whereClause);
    console.log("updatedField", updatedField);

    User.updateOne(whereClause, updatedField, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            console.log(" Profile updated");
    
        }
    })
})

    app.get('/final', (req, res) => {




        console.log(req.User);
        res.render("pages/final.ejs");

        // User.findOne({ email: email })
        // let subject = "Register Info";
        // let sentTo = req..email;
        // let content = "<b>Congrats You are Registered!</b>"

        // let sentResponse = utility.mailsend(subject, sentTo, content);

        // console.log("Email Send response " + sentResponse);
    })
    // })

    const razorpayInstance = new Razorpay({
        key_id: process.env.key_id,
        key_secret: process.env.key_secret
    });



    app.post('/createOrder', (req, res) => {



        const { amount, currency, receipt, notes } = req.body;


        razorpayInstance.orders.create({ amount, currency, receipt, notes },
            (err, order) => {


                if (!err)
                    res.json(order)
                else
                    res.send(err);
            }
        )

    });

    app.listen(8000, () => {
        console.log("app is running");

    })

