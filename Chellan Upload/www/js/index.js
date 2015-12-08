/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
		app.setUpEvents();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	
	//My code
	setUpEvents: function() {
		
        $('#takePictureBtn').on('click', app.getPictureFromCamera);
		
		$('#submitBtn').on('click', app.submitChellanForm);
		
		$('#resetBtn').on('click', function(){
			$('#submitBtn').prop('disabled', true);
			$('#picture').removeAttr('style');
		});

        //console.log('Received Event: ' + id);
    },	
	
	getPictureFromCamera: function() {
		navigator.camera.getPicture(onSuccess, onFail, { quality: 5, destinationType:Camera.DestinationType.DATA_URL }); 

		function onSuccess(imageData) {
			app.chellanImageData = imageData;
			$('#picture').css({'background': 'url(data:image/jpeg;base64,'+imageData+') top center no-repeat', 'background-size': 'contain', 'display': 'block'});
			$('#submitBtn').prop('disabled', false);
		}

		function onFail(message) {
			alert('Failed to take picture.');
		}    
	},
	
	submitChellanForm: function() {
		//alert("hi");
		var name = $('#name').val(),
			mobileNumber = $('#mobileNumber').val(),
			loanNumber = $('#loanNumber').val(),
			installmentNumber = $('#installmentNumber').val(),
			installmentAmount = $('#installmentAmount').val();
		if(name != '' && mobileNumber != '' && loanNumber != '' && installmentNumber != '' && installmentAmount != '') {
			
			$('#progress').show();
			
			$.ajax({
			   url:'http://agnelpraveen.freeoda.com/upload.php',
			   type:'POST',		   
			   crossDomain: true,
			   dataType: 'json',
			   data:{ name: name, mobileNumber: mobileNumber, loanNumber: loanNumber, installmentNumber: installmentNumber, installmentAmount: installmentAmount, imageData: app.chellanImageData },
			   success:function(data){
				 $('#log').text(data.chellans.length);
				 $('#progress').hide();
				 $('#message').show().removeClass('error').html("Chellan picture successfully submitted.");
			     $('#submitBtn').prop('disabled', true);
			   },
			   error:function(w,t,f){
				 $('#progress').hide();
				 $('#message').show().addClass('error').html(t + " error in upload. Please try again.");
			   }
			});
		} else {
			alert("Please fill all the fields.");
		}
			
	}
	
};
