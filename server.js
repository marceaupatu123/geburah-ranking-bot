const mongoose = require("mongoose");
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.dnpub.mongodb.net/test`,
    { keepAlive: true }
);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
    console.log("Connection To MongoDB Atlas Successful!");
});

/*INSERT GROUP ID AND COOKIE BELOW*/

var groupId = 12028259; // << Replace 12345 with your Group Id
/*INSERT GROUP ID AND COOKIE ABOVE*/

const axios = require("axios");
const express = require("express");
const rbx = require("noblox.js");
const app = express();
const webhook = process.env.webhook;

app.use(express.static("public"));

app.get(process.env.secretString, async (req, res) => {
    //await rbx.setCookie(process.env.token);
    var User = req.query.userid;
    var Rank = req.query.rank;
    var Accept = req.query.accept;
    var recruitementname = req.query.recruitmentname;
    var memberRequest = req.query.memberRequest;
    var playerdata = req.query.playerdata;
    var addpoints = req.query.addpoints;
    var ame = req.query.ame;
    var exile = req.query.exile
    var Username = req.query.username
    if (Rank && Username) {
        // rbx.setRank(groupId, parseInt(User), parseInt(Rank));

       // const Username = await rbx.getUsernameFromId(parseInt(User));
        const RankName = await req.param("rolename");

       // axios.post(webhook, { content: `**${Username}** has been promoted to **${RankName}**`, avatar_url: `https://www.roblox.com/headshot-thumbnail/image?userId=` + User + `&width=420&height=420&format=png`, }).catch((error) => { console.error(error); });
        axios.post(webhook, { content: `**${Username}** have to be promoted to **${RankName}**`, avatar_url: `https://www.roblox.com/headshot-thumbnail/image?userId=` + User + `&width=420&height=420&format=png`, }).catch((error) => { console.error(error); });
        res.json("Ranked");
      if (RankName == "[LR] Agent") {
        const sponsorschema = require("./sponsorshipschema.js")
        const modelspoints = require("./modelspoints.js")
        const card = await sponsorschema.findOne({RobloxIdSponsored: User })
        if (card != null ) {return}
        if (card.BecameAgent) {return}
        await modelspoints.findOneAndUpdate({ DiscordId: card.RobloxIdSponsoring },{ $inc: { Points: 6 } })
        await sponsorschema.findOneAndUpdate({ RobloxIdSponsored: User },{ $set: { BecameAgent: true } })
      }
    } else if (Accept && recruitementname && Username) {
       // const Username = await rbx.getUsernameFromId(parseInt(User));
        if (Accept == "true") {
            // rbx.handleJoinRequest(groupId, parseInt(User), true);
            res.json("Accepted!");
            axios.post(process.env.webhook2, {content: `**${Username}** has been recommended by **${recruitementname}**`,avatar_url: `https://www.roblox.com/headshot-thumbnail/image?userId=` +User +`&width=420&height=420&format=png`,}) .catch((error) => { console.error(error);}); 
            // rbx.message(User, "Response to your application to Geburah", `Dear ${Username},\n\nWe are pleased to announce that your application has been accepted by our recruitment agent \"${recruitementname}\".\n\nHowever, do not be too quick to claim victory as you have been assigned the rank of \"[LR] Enlisted\" which is a probationary rank.\n\nIn order to move up in rank you will have to attend a training session where a recruitment agent will be watching you discreetly during the whole event.\n\nIf you have been deemed qualified enough, this person will become your mentor throughout your career until you reach the rank of \"[MR] Senior Agent\".\n\nPlease purchase the uniform available in the group store and join our communication server also available on the group.\n\nHave a nice day,\n\nGeburah`);
        } else {
            // rbx.handleJoinRequest(groupId, parseInt(User), false);
            res.json("Denied!");
            axios.post(process.env.webhook2, { content: `**${Username}** has been denied by **${recruitementname}**`, avatar_url: `https://www.roblox.com/headshot-thumbnail/image?userId=` + User + `&width=420&height=420&format=png`, }).catch((error) => { console.error(error); });
        }
    } else if (memberRequest) {
        // const requests = await rbx.getJoinRequests(groupId);
        // res.json(requests);
        res.json("Not Working!")
    } else if (playerdata && User && addpoints) {
        require("./modelspoints.js");
        const playerModel = mongoose.model("Points");
        await playerModel.findOneAndUpdate(
            { RobloxId: `${User}` },
            { $set: { Points: addpoints } }
        );
        res.send("Updated Database.");
    } else if (playerdata && User) {
        require("./modelspoints.js");
        const playerModel = mongoose.model("Points");
        async function playerDataCheck() {
            const playerData = await playerModel.findOne({ RobloxId: `${User}` });

            if (playerData) {
                return playerData;
            } else {
                const newPlayerDataInstance = new playerModel({
                    RobloxId: `${User}`,
                    Points: 0,
                });

                const newPlayerData = await newPlayerDataInstance.save();

                return newPlayerData;
            }
        }

        res.json(await playerDataCheck());
    } else if (ame && User) {
        require("./modelame.js");
        const playerModel = mongoose.model("AME");
        async function playerDataCheck() {
            const playerData = await playerModel.findOne({ RobloxId: `${User}` });

            if (playerData) {
                return playerData;
            } else {
                return { "Level1": false, "Level2": false }
            }
        }

        res.json(await playerDataCheck());
    }
    else if (exile && User) {
    //   rbx.exile(groupId, parseInt(User))
    //   res.json("Player exiled !")
    axios.post(process.env.webhookexile, { content: `**${Username}** have been exiled.`, avatar_url: `https://www.roblox.com/headshot-thumbnail/image?userId=` + User + `&width=420&height=420&format=png`, }).catch((error) => { console.error(error); });
    }
});

app.get("/publicApi", async (req, res) => {
    var User = req.query.userid;
    var banned = req.query.banned;
    if (User && banned) {
        require("./modelban.js");
        const playerModel = mongoose.model("BAN");
        async function playerDataCheck() {
            const playerData = await playerModel.findOne({ RobloxId: `${User}` });

            if (playerData) {
                return playerData;
            } else {
                return { "status": 404, "message": "BAN not found", "Global": false, "Ban": false, "Reason": false }
            }
        }

        res.json(await playerDataCheck());
    }
})

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
