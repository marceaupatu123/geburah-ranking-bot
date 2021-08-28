/*INSERT GROUP ID AND COOKIE BELOW*/

var groupId = 12028259; // << Replace 12345 with your Group Id
/*INSERT GROUP ID AND COOKIE ABOVE*/

function parseBool(string) {
  switch (string.toLowerCase().trim()) {
    case "true":
    case "yes":
    case "1":
      return true;
    case "false":
    case "no":
    case "0":
    case null:
      return false;
    default:
      return Boolean(string);
  }
}
const axios = require("axios");
const express = require("express");
const rbx = require("noblox.js");
const app = express();
const webhook = process.env.webhook;

app.use(express.static("public"));

app.get(process.env.secretString, async (req, res) => {
  await rbx.setCookie(process.env.token);
  var User = req.param("userid");
  var Rank = req.param("rank");
  var Accept = req.param("accept");
  var recruitementname = req.param("username")
  var memberRequest = req.param("memberRequest")
  if (Rank) {
    rbx
      .setRank(groupId, parseInt(User), parseInt(Rank))
      res.json("Ranked");

    const Username = await rbx.getUsernameFromId(parseInt(User));
    const RankName = await rbx.getRankNameInGroup(groupId, parseInt(User));
    
    
    axios
      .post(webhook, {
        content: `**${Username}** has been promoted to **${RankName}**`
      })
      .catch(error => {
        console.error(error);
      });
  } else if (Accept && recruitementname) {
    const Username = await rbx.getUsernameFromId(parseInt(User));
    if (Accept == "true") {
    rbx.handleJoinRequest(groupId, parseInt(User), true);
    res.json("Accepted!");
      axios
      .post(process.env.webhook2, {
        content: `**${Username}** has been accepted by **${recruitementname}**`
      })
      .catch(error => {
        console.error(error);
      });
    rbx.message(User, "Response to your application to Geburah", `Dear ${Username},\n\nWe are pleased to announce that your application has been accepted by our recruiting agent \"${recruitementname}\".\n\nHowever, do not be too quick to claim victory as you have been assigned the rank of \"[LR] Enlisted\" which is a probationary rank.\n\nIn order to move up in rank you will have to attend a training session where a recruiting agent will be watching you discreetly during the whole event.\n\nIf you have been deemed qualified enough, this person will become your mentor throughout your career until you reach the rank of \"[MR] Senior Agent\".\n\nPlease purchase the uniform available in the group store and join our communication server also available on the group.\n\nHave a nice day,\n\nGeburah`)
  } else {
    rbx.handleJoinRequest(groupId, parseInt(User), false);
    res.json("Denied!");
      axios
      .post(process.env.webhook2, {
        content: `**${Username}** has been denied by **${recruitementname}**`
      })
      .catch(error => {
        console.error(error);
      });
  }
    
  } else if (memberRequest) {
    const requests = await rbx.getJoinRequests(groupId)
    res.json(requests)
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
