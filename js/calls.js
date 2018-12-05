/* * * * * * * * * * * * * * * *
 * BONFIRE - A Live Music Queue
 * Authors:
 *    Gianne Flores
 *    Juan Parra
 *    Jose Torres
 *    Ryan Zeng
 * 
 * UF Web Apps - Fall 2018
 */ 

const update_queue_playlist = (res) => {
	const queue_id = getCookie('bonfire_queue_id');
    console.log(queue_id);
	const url_id   = '/queue/update/playlist_id?playlist_id='   + res.id  + '&id=' + queue_id;
	const url_uri  = '/queue/update/playlist_uri?playlist_uri=' + res.uri + '&id=' + queue_id;
	$.ajax({
        url: url_id,
        method: 'PUT',
        success: (response) => { setCookie('bonfire_playlist_id', res.id, 1); console.log('playlist id is: ' + getCookie('bonfire_playlist_id'))}
    });

    $.ajax({
        url: url_uri,
        method: 'PUT',
        success: (response) => { setCookie('bonfire_playlist_uri', res.uri, 1); console.log('playlist uri is: ' + getCookie('bonfire_playlist_uri'))}
    });
}

const update_queue_user = (res) => {
	const queue_id = getCookie('bonfire_queue_id');
	const url      = '/queue/update/creator?creator=' + res.id + '&id=' + queue_id;
	$.ajax({
        url: url,
        method: 'PUT',
        success: (response) => { setCookie('bonfire_user_id', res.id, 1); console.log('id is: ' + getCookie('bonfire_user_id'))}
    });
}

const update_queue_dev_id = (dev_id, queue_id) => {
    const url = '/queue/update/device_id' +
                '?device_id=' + dev_id + 
                '&id='        + queue_id;

    $.ajax({
        url: url,
        method: 'PUT',
        success: (response) => { console.log(response); }
    });
}

const get_user = (access_token, res_func) => {
	$.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: (response) => { console.log('user info:\n' + response.id); res_func(response); }
    });
}

const refreshtoken = (refresh_token, res_func) => {
	$.ajax(
 		{
          url: '/refresh_token',
          data: {
            'refresh_token': refresh_token
          }
        })
    .done( (data) => { res_func(data.access_token); } );
}

const create_pl = (access_token, user_id, res_func) =>{
$.ajax({
   url: '/create_pl?access_token=' + access_token+'&user_id='+user_id,
   method: 'POST',
   data: {
     'access_token': access_token,
     'user_id': user_id 
   },
   success: (response) => {res_func(response);},
 });
}

const add_track = (access_token, track_uri, playlist_id, res_func) =>{
    console.log("TRACK _ U R I _ 1  1 1", track_uri);

    track_uri = stringToQuery(track_uri, false);
    console.log("TRACK _ U R I _ 2 2 2", track_uri);

    $.ajax({
        url: '/add_track?access_token=' + access_token + '&track_uri=' + track_uri + '&playlist_id=' + getCookie('bonfire_playlist_id'),
        method: 'POST',
        data: {
            'access_token': access_token,
            'track_uri': track_uri,
            'playlist_id': playlist_id  
   },
   success: (response) => { console.log(response); }
 });
}

const start = (access_token, device_id, playlist_uri, res_func) =>{
$.ajax({
   url: '/start',
   method: 'POST',
   data: {
     'access_token': access_token,
     'device_id': device_id,
     'playlist_uri': playlist_uri 
   },
   success: (response) => { console.log(response); }
 });
}

var view = true;
var viewSwitch = document.getElementById('switch-view');
/*
viewSwitch.addEventListener("click", function(){
    view = !view;
});*/

const refresh_token = getCookie('spotify_ref_token');
const search = (access_token, query) =>{
    var url = '/search' +
    '?access_token=' + access_token + 
    '&query=' + stringToQuery(query, true);
    console.log(url);
   $.ajax(
    {
      type: "GET",
      url: '/search',
        data:{
          'access_token': access_token,
          'query': query
        },
        fail: () => { console.log('fail'); }
    }
  ).done((data) => { 
      var resultsContainer = document.getElementById('search-results-container');
      removeChildNodes(resultsContainer);
      
      for(var i = 0; i < data.tracks.items.length; i++){
        if(view){  
            console.log(data.tracks.items[i].name + " " + data.tracks.items[i].uri + " " + data.tracks.items[i].id);
            var track_uri = data.tracks.items[i].uri;
            var results = document.createElement('div');
            var para = document.createElement('p');
            var name = document.createTextNode("Track Name: " + data.tracks.items[i].name);
            para.appendChild(name);
            results.appendChild(para);
            var uri = document.createTextNode("Track URI: " + track_uri);
            para.appendChild(uri);
            results.appendChild(para);
            var id = document.createTextNode("Track ID: " + data.tracks.items[i].id);
            para.appendChild(id);
            results.appendChild(para);
             var img_url = data.tracks.items[i].album.images[0].url;
            var img = document.createElement('img');
            img.src = img_url;
            img.className = "search-results-image";
            results.appendChild(img);
            
            results.appendChild(addTrackBtn(access_token, track_uri, getCookie('bonfire_playlist_id')));
            results.className = 'search-results';
         }
        else{
            console.log(data.tracks.items[i].name + " " + data.tracks.items[i].uri + " " + data.tracks.items[i].id);
            var track_uri = data.tracks.items[i].uri;
            var results = document.createElement('div');
            var para = document.createElement('p');
            var name = document.createTextNode("Track Name: " + data.tracks.items[i].name);
            para.appendChild(name);
            results.appendChild(para);
            var uri = document.createTextNode("Track URI: " + data.tracks.items[i].uri);
            para.appendChild(uri);
            results.appendChild(para);
            var id = document.createTextNode("Track ID: " + data.tracks.items[i].id);
            para.appendChild(id);
            results.appendChild(para);
             var addBtn = document.createElement('button');
            var btnText = document.createTextNode("Add Track");
            addBtn.appendChild(btnText);
            addBtn.addEventListener("click",
                ()=>{
                    console.log(access_token);
                }, false
            );
            results.appendChild(addBtn);
            results.className = 'search-results-list';
    
        }
        resultsContainer.appendChild(results);
       }
    });
     var removeChildNodes = function(parentDiv){
		while (parentDiv.hasChildNodes()) {
			parentDiv.removeChild(parentDiv.firstChild);
		}
    };

    var addTrackBtn = function(access_token, track_uri, playlist_id){
        var addBtn = document.createElement('button');
        var btnText = document.createTextNode("Add Track");
        addBtn.appendChild(btnText);
            addBtn.addEventListener("click",
                ()=>{
                    add_track(access_token, track_uri, playlist_id );
                    console.log("Adding track", track_uri);
                    console.log
                }, false
            );
        return addBtn;
    }
}


const list_devices = (devlist) => {
    let dev_list   = '<ul style = "list-style-type: none">';
    const queue_id = getCookie('bonfire_queue_id');
    if (devlist.length) {
        for (var i = 0; i < devlist.length; ++i) {
            var dev = '<li><a href="javascript:select_id(\'' + devlist[i].id +'\',\'' + queue_id + '\', \'' + devlist[i].name + '\');">name: ' + devlist[i].name + '</a></li>';
            dev_list += dev;
        }
    }
    else {
        dev_list += '<li>no devices available</li>';
    }

    dev_list += '</ul>';
    document.getElementById('device_list').innerHTML = dev_list;
}

const avail_dev = (access_token, res_func) => {
	$.ajax(
        {
        	url: '/avail_dev',
            data: { 
          		'access_token': access_token
            },
            
  			fail: () => { console.log('fail'); }
    	}
  	).done((data) => { res_func(data.devices);  });
}

const select_id = (dev_id, queue_id, dev_name) => {
    setCookie('bonfire_dev_id', dev_id);
    setCookie('bonfire_dev_name', dev_name);
    update_queue_dev_id(dev_id, queue_id);
    console.log('current device id is: ' + getCookie('bonfire_dev_id'));

    $('#device_list').html('<p>Current device: '+ getCookie('bonfire_dev_name') +'</p>');
    $('#new-dev').html('select new device');
    $('#new-dev').on('click', () => { 
        $('#new-dev').html('refresh devices');
        setCookie('bonfire_dev_id', "", 1); 
        avail_dev(getCookie('spotify_acc_token'), list_devices); });
}

