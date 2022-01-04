const fetch = require('node-fetch');

const API_KEY = process.env.CVS_API_KEY || "a2ff75c6-2da7-4299-929d-d670d827ab4a"

const CVS = {
  getSites(location){
    let url = `https://www.cvs.com/RETAGPV3/MCscheduler/V1/storeScheduler?addressLine=${location}&mileRadius=15&maxCount=25`
    data = {"request":{"header":{"lineOfBusiness":"Retail","appName":"CVS_APP","apiKey": API_KEY ,"channelName":"WEB","deviceToken":"d9708df48d23192e","deviceType":"DESKTOP","responseFormat":"JSON","securityType":"apiKey","source":"CVS_WEB","type":"retlegget"}}}
    return fetch(url, {method: "POST", body: JSON.stringify(data)}).then(x=>x.json()).catch(console.error);
  },
  getSlots(clinicId, startDate, endDate){
    clinicId = clinicId.toString()
    let url = 'https://www.cvs.com/RETAGPV3/scheduler/V3/getAvailableSlots'
    data = {"request":{"header":{"lineOfBusiness":"RETAIL","appName":"CVS_APP","apiKey":API_KEY,"channelName":"WEB","deviceToken":"d9708df48d23192e","deviceType":"DESKTOP","responseFormat":"JSON","securityType":"apiKey","source":"CVS_WEB","type":"retleg"},"startDate":startDate,"endDate":endDate,"visitCode":"48","clinicId": clinicId}}
    console.log(JSON.stringify(data))
    return fetch(url, {method: "POST", body: JSON.stringify(data)}).then(x=>x.text()).then(console.log).catch(console.error);
  },
  parseCvsSites(response){
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
    result = []
    for (let x in clinicMap){
      // address
      let addr = clinicMap[x].address + " " + clinicMap[x].zipCode
      result.push({'address': addr, 'date': dateMap[x], 'clinicId': x})
    }
    return result
  },

  parseCvsSlots(response){
    if (response && response.response && response.response.details){
      return response.response.details.filter(x=>x.availableSlots.length)
    } else {
      return [];
    }

  }
}

module.exports = CVS;
