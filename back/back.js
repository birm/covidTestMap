const express = require('express');
const CVS = require('./cvsHandlers.js')
const PORT = process.env.PORT || 4010;

var app = express();

app.use(express.static('static'))

app.get("/api/sites/:location", function(req,res){
  console.log(req.params)
  CVS.getSites(req.params.location).then(x=>{
    res.json(CVS.parseCvsSites(x));
  })
})

// These requests consistently seem to trip ddos prevention. Hope no slot details is ok!
/*
app.get("/api/slots/:clinicId", function(req,res){
  dateOptions = {day:"2-digit", month:"2-digit", year:"numeric"}
  let startDate = new Date();
  startDate = startDate.toLocaleDateString("en-US", dateOptions);
  let a = new Date();
  let endDate = new Date(a.setDate(a.getDate()+7));
  endDate = endDate.toLocaleDateString("en-US", dateOptions);
  CVS.getSlots(req.params.clinicId, startDate, endDate).then(x=>{
    res.json(CVS.parseCvsSlots(x));
  })
})
*/
/*
app.get("/api/combined/:location", async function(req, res){
  dateOptions = {day:"2-digit", month:"2-digit", year:"numeric"}
  let startDate = new Date();
  startDate = startDate.toLocaleDateString("en-US", dateOptions);
  let a = new Date();
  let endDate = new Date(a.setDate(a.getDate()+7));
  endDate = endDate.toLocaleDateString("en-US", dateOptions);
  let result = {}
  CVS.getSites(req.params.location).then(async x=>{
    for (let y of CVS.parseCvsSites(x)){
      z = await CVS.getSlots(y.clinicId, startDate, endDate).then(parseCvsSlots)
      result.push({address: y.address, clinicId: y.clinicId, slotInfo:z})
    }
    res.json(result);
  })
})
*/


// error handler
app.use(function(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  // wrap strings in a json
  if (typeof err === 'string' || err instanceof String) {
    err = {'error': err};
    console.error(err);
  } else {
    console.error(err.error || err.message || err.toString());
  }
  res.status(statusCode).json(err);
});


app.listen(PORT, () => console.log('listening on ' + PORT));
