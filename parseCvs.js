function parseCvs(response){
  // get clinic map
  let clinicMap = {}
  for (let x in response.response.clinicDetails){ clinicMap[response.response.clinicDetails[x].clinicId] = response.response.clinicDetails[x] }
  // get first avaliable day per clinic key
  let dateMap = {}
  for (let x in response.response.details.dates){
    let cid = response.response.details.dates[x].clinicId
    let freeDates = response.response.details.dates[x].dates.filter(x=>(x["isSlotAvailable"]))
    if (freeDates.length){
      dateMap[cid] = freeDates[0].date
    } else {
      dateMap[cid] = "nothing soon"
    }
  }
  // put them together to give me a list of addresses with dates
  res = []
  for (let x in clinicMap){
    // address
    let addr = clinicMap[x].address + " " + clinicMap[x].zipCode
    res.push({'address': addr, 'date': dateMap[x], 'clinicId': x})
  }
  return res
}
