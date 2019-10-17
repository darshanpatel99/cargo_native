// uploadThumbnailToFirebase = async (uri, localSizeObject)=>{
//     console.log('inside the upload thumbnial function');

//     console.log("width " + localSizeObject.width + " height " + localSizeObject.height)

//     var changedH = {
//       'isBiggest' : false,
//       'value' : localSizeObject.height,
//     }
//    var changedW = {
//     'isBiggest' : false,
//     'value' : localSizeObject.width,
//     'valid' : true,
//   }

//   var difValue = 1 ;
   
//    if(changedH.value < changedW.value){
//      changedW.isBiggest = true;

//     if(changedW.value  <= 400){
//       changedW.valid = false
//     }
    
//    }
//    else{
//      changedH.isBiggest = true;
//      if(changedH.value  <= 400){
//        changedH.valid = false
//      }
      
//    }

//     if(changedH.isBiggest == true && changedH.valid == true){
//       difValue = Math.round(changedH.value/400);
//     }

//     if(changedW.isBiggest == true && changedW.valid == true){
//       difValue =Math.round(changedW.value/400) ;
//     }

//     var finalH = 1 ; 
//     var finalW = 1 ;
    
//     finalH = changedH.value/difValue;

//     finalW = changedW.value/difValue;

//     console.log(finalW + "  " + finalH)

//     const manipResult = await ImageManipulator.manipulateAsync(
//       uri,
//       [{ resize:{width:finalW, height:finalH} }],
//       { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
//     )

//       console.log("Hey I  am the ManipResult:  "+ manipResult.uri);

      
//       const response = await fetch(manipResult.uri);
//       const blob =  await response.blob();
//       console.log('Inside Thumnail upload Image to Firebase')
//       var uploadTask = storageRef.child('images/'+uuid.v1()).put(blob);
//       const that = this;
      
//       // Register three observers:
//       // 1. 'state_changed' observer, called any time the state changes
//       // 2. Error observer, called on failure
//       // 3. Completion observer, called on successful completion
//       uploadTask.on('state_changed', function(snapshot){
//         // Observe state change events such as progress, pause, and resume
//         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log('Upload is ' + progress + '% done');
//         switch (snapshot.state) {
//           case firebase.storage.TaskState.PAUSED: // or 'paused'
//             console.log('Upload is paused');
//             break;
//           case firebase.storage.TaskState.RUNNING: // or 'running'
//             console.log('Upload is running');
//             break;
//         }
//       }, function(error) {
//         // Handle unsuccessful uploads
//       }, function() {
//         // Handle successful uploads on complete
//         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//         uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
//           console.log('Thumbnail File available at', downloadURL);
//           that.setState({thumbnail:downloadURL}); // setting the Thumbnail URL
//           var uploadC = that.state.uploadCounter+1;
//           that.setState({uploadCounter:uploadC});

//         });
//       });
//     }