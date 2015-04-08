// KPR Script file
var THEME = require('themes/sample/theme');
var BUTTONS = require("controls/buttons");
var SCREEN = require('mobile/screen');
var SCROLLER = require('mobile/scroller');

//skins
var whiteSkin = new Skin( { fill:"white" } );
var blackSkin = new Skin( { fill:"black" } );
var separatorSkin = new Skin({ fill: 'silver',});
var labelStyle = new Style( { font: "bold 30px", color:"black" } );
var whiteBorderSkin = new Skin({
  fill:"white", 
  borders:{bottom:5}, 
  stroke:"black"
});
//styles
var tabStyle = new Style( { font: "bold 15px", color:"white" } );
var titleStyle = new Style({font: "bold 30px", color:"black"});

washerTimeOne = 0;
washerInUseOne = 0;
washerTimeTwo = 0;
washerInUseTwo = 0;
dryerTimeOne = 0;
washerInUseOne = 0;
dryerTimeTwo = 0;
washerInUseTwo = 0;

var update = function(json){
	// Use this function to update UI elements instantly/live
	washerTimeOne = json.washerTimeOne;
	washerInUseOne = json.washerInUseOne;
	washerTimeTwo = json.washerTimeTwo;
	washerInUseTwo = json.washerInUseTwo;
	dryerTimeOne = json.dryerTimeOne;
	washerInUseOne = json.washerInUseOne;
	dryerTimeTwo = json.dryerTimeTwo;
	washerInUseTwo = json.washerInUseTwo;
}

Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		deviceURL = JSON.parse(message.requestText).url;
		handler.invoke(new Message(deviceURL + "getAllInfo"), Message.JSON);
	},
	onComplete: function(content, message, json){
		update(json);
     	application.invoke( new Message("/startPolling"));
	}	
}));

Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		deviceURL = "";
	}
}));

Handler.bind("/startPolling", {
    onInvoke: function(handler, message){
		handler.invoke(new Message(deviceURL + "getAllInfo"), Message.JSON);
	},
	onComplete: function(content, message, json){
		update(json);
     	application.invoke( new Message("/delay"));
    }
});

Handler.bind("/delay", {
    onInvoke: function(handler, message){
        handler.wait(1000); //will call onComplete after 1 second
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/startPolling"));
    }
});

//tab template
var buttonTemplate = BUTTONS.Button.template(function($){ return{
	left: $.leftPos, width:$.width, bottom:$.bottom, height:20, name:$.name, skin:blackSkin,
	contents: [
		new Label({left:0, right:0, height:20, string:$.textForLabel, style: tabStyle})
		],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			if ($.textForLabel == "Hamper") {
				if (machinesCon.container) {
					mainContainer.remove(machinesCon);
				} else if (creditsCon.container) {
					mainContainer.remove(creditsCon);
				}
				if (!hamperCon.container) {
					mainContainer.add(hamperCon);
				}
			} else if ($.textForLabel == "Machines") {
				if (hamperCon.container) {
					mainContainer.remove(hamperCon);
				} else if (creditsCon.container) {
					mainContainer.remove(creditsCon);
				}
				if (!machinesCon.container) {
					mainContainer.add(machinesCon);
				}
			
			}else if ($.textForLabel == "Credits") {
				if (hamperCon.container) {
					mainContainer.remove(hamperCon);
				} else if (machinesCon.container) {
					mainContainer.remove(machinesCon);
				}
				if (!creditsCon.container) {
					mainContainer.add(creditsCon);
				}
			
			} else if ($.textForLabel == "Washers") {
				if (!washersCon.container && dryersCon.container) {
					machinesCon.remove(dryersCon);
					machinesCon.add(washersCon);
				} 
				
			} else if ($.textForLabel == "Dryers") {
				if (!dryersCon.container && washersCon.container) {
					machinesCon.remove(washersCon);
					machinesCon.add(dryersCon);
				}
			}
		}},
		onComplete: { value: function(content, message, json){
		}}
	})
}});

//tabs
var hamper = new buttonTemplate({leftPos:0,width:107, bottom:0,  textForLabel: "Hamper"});
var machines = new buttonTemplate({leftPos:107, width:107, bottom:0, textForLabel: "Machines"});
var credits = new buttonTemplate({leftPos:214, width:108, bottom:0, textForLabel:"Credits"});

var washers = new buttonTemplate({leftPos:0,width:161, bottom:496,  textForLabel: "Washers"});
var dryers = new buttonTemplate({leftPos:161, width:161, bottom:496, textForLabel: "Dryers"});



var containerTemplate = Container.template(function($) { return {
	left: 0, right: 0, top: 0, bottom: $.bottom, skin: whiteSkin, active: true, contents:$.contents,
	behavior: Object.create(Container.prototype, {
		onTouchEnded: { value: function(content){
			content.focus();
		}}
	})
}});
var titleLabel =  new Label({left:105,top:0, right:0, height: 40, string: "Washr", style: labelStyle});
var scroller = SCROLLER.VerticalScroller.template(function($){ return{
    contents: $.contents
}});
var scrollableCon = new scroller({ name: "comicScroller", left: 0, right: 0, 
    contents: [
        new Column({name: "comic", top: 60, left: 0, right: 0, skin:blackSkin,
        	contents: [
        		new Label({left:0, right:0, string: "alkjdflajdflaf", style:tabStyle}),
        		new Label({left:0, right:0, string: "alkjdflajdflaf", style:tabStyle}),
        	]}) 
    ]
})


//containers
var machinesCon = new containerTemplate({bottom: 20});
//machinesCon.add(scrollableCon);
machinesCon.add(washers);
machinesCon.add(dryers);
//machinesCon.add(ListPane);
//var machinesSubCon = new containerTemplate({bottom: 20});
var washersCon = new containerTemplate({top:20, bottom: 20});
machinesCon.add(washersCon);
var dryersCon = new containerTemplate({top:20, bottom: 20});
var hamperCon = new containerTemplate({bottom:20});
var creditsCon = new containerTemplate({bottom:20,
	contents:[
		new Label({left:0, right:0, top:10, string: "Credits", style: titleStyle})
	]});


var mainContainer = new containerTemplate({bottom:0});
mainContainer.add(hamper);
mainContainer.add(machines);
mainContainer.add(credits);
mainContainer.add(hamperCon);
application.add(mainContainer);

var ApplicationBehavior = Behavior.template({
	onDisplayed: function(application) {
		application.discover("washdevice.app");
	},
	onQuit: function(application) {
		application.forget("washdevice.app");
	},
})

application.behavior = new ApplicationBehavior();
