$(document).ready(function() {
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyChAFB77NG3OTgEVIQXzrUbL29G_IYLGJo",
        authDomain: "train-scheduler-b2fa7.firebaseapp.com",
        databaseURL: "https://train-scheduler-b2fa7.firebaseio.com",
        projectId: "train-scheduler-b2fa7",
        storageBucket: "train-scheduler-b2fa7.appspot.com",
        messagingSenderId: "895174463602"
    };
    
    firebase.initializeApp(config);
    
    var dataRef = firebase.database();
    var trainName = "";
    var line = "";
    var destination = "";
    var trainTime = "";
    var frequency = "";
    
    $("#addTrainBtn").on('click', function(event){
        event.preventDefault();
        trainName = $("#trainName").val().trim();
        line = $("#line").val().trim();
        destination = $("#destination").val().trim();
        trainTime = moment($("#trainTime").val().trim(), "HH:mm").subtract(10, "years").format("X");
        frequency = $("#frequency").val().trim();
        
        dataRef.ref().push( {
            trainName: trainName,
            line: line,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency
        });

        //Emptys Element After Input
        $("#trainName").val("");
        $("#line").val("");
        $("#destination").val("");
        $("#trainTime").val("");
        $("#frequency").val("");
    });

    //Referencing Data to call back from Firebase
    dataRef.ref().on("child_added", function(childSnapshot){

        //Assigning New Variables For Call back
        var firebasetrainName = childSnapshot.val().trainName;
        var firebaseLine = childSnapshot.val().line;
        var firebaseDestination = childSnapshot.val().destination;
        var firebasetrainTime = childSnapshot.val().trainTime;
        var firebaseFrequency = childSnapshot.val().frequency;

        //Moments In Time
        var diffTime = moment().diff(moment.unix(firebasetrainTime),
        "minutes");
        var timeRemainder = moment().diff(moment.unix(firebasetrainTime), "minutes") % firebaseFrequency;
        var minutes = firebaseFrequency - timeRemainder;

        var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A");

        //Adding Firebase Train Data to Top index Table
        $("#trainTable > tbody").append("<tr><td>" + firebasetrainName + "</td><td>" + firebaseLine + "</td><td>" + firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");
    });
});