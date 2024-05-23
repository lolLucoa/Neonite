const NeoLog = require("../structs/NeoLog");
const fs = require('fs');
const path = require('path');
const {getVersionInfo, fileversionBuffer} = require("../config/defs")


module.exports.http = {
    middleware: {
      order: [
        'LogURL',   
        'bodyParser'   
      ],
      LogURL: function (req, res, next) {
        try{
          const {versionGlobal} = getVersionInfo(req);
          if (versionGlobal && (/^\d+$/.test(versionGlobal) || versionGlobal === "Cert" || versionGlobal === "Live" || versionGlobal === "Next")) {
            const directoryPath = path.join(__dirname, `../ClientSettings/s${versionGlobal}`);
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }
            const filePath = path.join(directoryPath, 'ClientSettings.sav');
            if (!fs.existsSync(filePath)) {
                fileversionBuffer(64, filePath);
              }
          }
          if(req.originalUrl = "/fortnite/api/cloudstorage/user/*" && req.method == "PUT"){
            var rawParser = require("body-parser").raw({type: "*/*"});		
            req.setEncoding("latin1");
            rawParser(req, res, (err) => {
            req.rawBody = ""
            req.on("data", (chunk) => req.rawBody += chunk)
            req.on("end", () => {
              fs.writeFileSync(path.join(__dirname, `../ClientSettings/s${versionGlobal}/ClientSettings.sav`), req.rawBody, 'latin1');
            });
          });
          res.status(204).end();
          }
        }
        catch{}
        const startTime = new Date();
        res.on('finish', () => {
          const endTime = new Date();
          const responseTime = endTime - startTime;
            if (req.originalUrl === "/fortnite/api/calendar/v1/timeline") {
          } 
          else 
          {
            NeoLog.URL(`${req.originalUrl} (${responseTime}ms)`);
          }
        });
        next();
        },
        bodyParser: require('skipper')({ strict: false }),
    
    }
}