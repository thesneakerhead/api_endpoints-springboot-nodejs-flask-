const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const database = admin.database();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.deQueue = functions.region("asia-southeast1")
    .https.onRequest((request, response) =>{
      const clinicUID = request.body.clinicUID;
      const ref = database.ref("clinicDictionary/"+clinicUID+"/clinicQueue");
      ref.once("value", (snapshot)=>{
        const queue = snapshot.val();
        if (queue!=null) {
          queue.shift();
          ref.set(queue);
          response.send("patient dequeued!");
        } else {
          response.send("there is nobody in the queue!");
        }
      }, (errorObject)=>{

      });
    });

exports.joinQueue = functions.region("asia-southeast1")
    .https.onRequest((request, response) =>{
      const clinicUID = request.body.clinicUID;
      const patientUID = request.body.patientUID;
      const ref = database.ref("clinicDictionary/"+clinicUID+"/clinicQueue");
      ref.once("value", (snapshot)=>{
        let queue = snapshot.val();
        if (queue!=null) {
          queue.push(patientUID);
          ref.set(queue).then((r) => {
            response.send("Added to queue!");
          });
        } else {
          queue = [];
          queue.push(patientUID);
          ref.set(queue).then((r) => {
            response.send("Added to queue!");
          });
        }
      }, (errorObject)=>{
        response.send("Could not resolve path");
      });
    });

exports.checkQueuePos = functions.region("asia-southeast1")
    .https.onRequest((request, response)=>{
      const patientUID = request.body.patientUID;
      const clinicUID = request.body.clinicUID;
      const ref = database.ref("clinicDictionary/"+clinicUID+"/clinicQueue");
      ref.once("value", (snapshot)=>{
        const queue = snapshot.val();
        const pos = queue.indexOf(patientUID);
        if (pos<0) {
          response.send("patient is not in queue!");
        } else {
          response.send(String(queue.indexOf(patientUID)+1));
        }
      }, (errorObject)=>{

      });
    });
exports.removeFromQueue= functions.region("asia-southeast1")
    .https.onRequest((request, response)=>{
      const patientUID = request.body.patientUID;
      const clinicUID = request.body.clinicUID;
      const ref = database.ref("clinicDictionary/"+clinicUID+"/clinicQueue");
      ref.once("value", (snapshot)=>{
        const queue = snapshot.val();
        const pos = queue.indexOf(patientUID);
        if (pos<0) {
          response.send("patient is not in queue!");
        } else {
          queue.splice(pos, 1);
          ref.set(queue);
          response.send("patient deleted!");
        }
      }, (errorObject)=>{

      });
    });

exports.addWalkInPatient = functions.region("asia-southeast1")
    .https.onRequest((request, response) =>{
      const clinicUID = request.body.clinicUID;
      const walkInName = request.body.walkInName;
      const ref = database.ref("clinicDictionary/"+clinicUID+"/clinicQueue");
      ref.once("value", (snapshot)=>{
        let queue = snapshot.val();
        if (queue!=null) {
          queue.push(walkInName);
          ref.set(queue).then((r) => {
            response.send("Added to queue!");
          });
        } else {
          queue = [];
          queue.push(walkInName);
          ref.set(queue).then((r) => {
            response.send("Added to queue!");
          });
        }
      }, (errorObject)=>{
        response.send("Could not resolve path");
      });
    });
