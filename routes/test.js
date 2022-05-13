const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("data.csv");

const jsonData = [ 
  { id: 1,
    name: 'Node.js',
    description: 'JS web applications',
    created_at: '2021-09-02' },
  { id: 2,
    name: 'Vue.js',
    description: 'for building UI',
    created_at: '2021-09-05' },
  { id: 3,
    name: 'Angular.js',
    description: 'for building mobile & desktop web app',
    created_at: '2021-09-08' } ];

fastcsv
  .write(jsonData, { headers: true })
  .on("finish", function() {
    console.log("Write to CSV successfully!");
  })
  .pipe(ws);


  router.get("/test", (req,res) => {
    inventories.find({}, function(err,inventory){
        res.render('testpod', {
            itemList: inventory,
        })
    })
})


function findScheduleList (req,res){
  let agent = req.body.agentName
  let date = req.body.dateSchedule
  deliScheduleDB.find({}, (err,list) => {
      if (agent == list.agentName && date == list.dateSchedule){
          res.render('schlist',{
              scheduleList: list,
              name: currentUser.name,
              icNumber: currentUser.icNumber,
              position: currentUser.position,
          })
      }
      else{
          alert(`No List available`)
      }
  })
}

router.get('/itemoutsss', (req,res) => {
  getItemOut(req,res)
})

function getItemOut(req,res){
  inventories.find({},(err,outlist) => {
      res.render('itemout', {
          itemList: outlist,
          name: currentUser.name,
          icNumber: currentUser.icNumber,
          position: currentUser.position,

      })
  })
}

router.post('/pout', (req,res) => {
  addToPod(req,res)
})