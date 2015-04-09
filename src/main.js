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

washerTimeOne = 0;
washerInUseOne = 0;
washerTimeTwo = 0;
washerInUseTwo = 0;
dryerTimeOne = 0;
dryerInUseOne = 0;
dryerTimeTwo = 0;
dryerInUseTwo = 0;
washerOneBool = false;
washerTwoBool = false;
dryerOneBool = false;
dryerTwoBool = false;


var update = function(json){
	// Use this function to update UI elements instantly/live
	washerTimeOne = json.washerTimeOne;
	washerInUseOne = json.washerInUseOne;
	washerTimeTwo = json.washerTimeTwo;
	washerInUseTwo = json.washerInUseTwo;
	dryerTimeOne = json.dryerTimeOne;
    dryerInUseOne = json.dryerInUseOne;
	dryerTimeTwo = json.dryerTimeTwo;
	dryerInUseTwo = json.dryerInUseTwo;
	addLoads();
	timeChange();
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
        new Column({name: "comic", top: 0, left: 0, right: 0, skin:blackSkin,
        	contents: [
        		new Label({left:0, right:0, string: "alkjdflajdflaf", style:tabStyle}),
        		new Label({left:0, right:0, string: "alkjdflajdflaf", style:tabStyle}),
        	]}) 
    ]
})


//containers
var machinesCon = new containerTemplate({bottom: 20});
machinesCon.add(scrollableCon);
//machinesCon.add(ListPane);
var hamperList = new Column({left: 0, right: 0, skin:blackSkin});
var hamperCon = new containerTemplate({bottom:20,
    contents:[
        titleLabel,
        new Label({left:0, right:0, top: 45, height: 30, string: "My Loads", style: labelStyle, skin: whiteBorderSkin}),
        new scroller({top:70, left: 0, right: 0, contents:[ 
            hamperList
            ]
        })
]});

var loads = Line.template(function($){return{
    left:0, right:0, skin:blackSkin, contents:[
        Picture($,{
            left:0, width:100, height:50, url:$.yurl
        }),
        Label($,{
            width: 100, height: 40, string:$.text, style:tabStyle,
        }),
        Label($,{
             name:"myTime", width:100, height: 40, string:"Time" + $.time, style:tabStyle,
        }),
        
    ]
}});
var washer1 = new loads({yurl:"./orange.jpeg", text:"Washer One", time:washerTimeOne});
var washer2 = new loads({yurl:"./orange.jpeg", text:"Washer Two", time:washerTimeTwo});
var dryer1 = new loads({yurl:"./orange.jpeg", text:"Dryer One", time:dryerTimeOne});
var dryer2 = new loads({yurl:"./orange.jpeg", text:"Dryer Two", time:dryerTimeTwo});

var addLoads = function(){
    if (washerInUseOne === 1 && washerOneBool === false){
        hamperList.add(washer1);
        washer1.add(new Label({string: "HII"}));
        washerOneBool = true;
    }
    if(washerInUseTwo === 1 && washerTwoBool === false){
        hamperList.add(washer2);
        washerTwoBool = true;
    }
    if(dryerInUseOne === 1 && dryerOneBool === false){
        hamperList.add(dryer1);
        dryerOneBool = true;   
    }
    if(dryerInUseTwo === 1 && dryerTwoBool === false){
       hamperList.add(dryer1);
       dryerTwoBool = true;
    }
    if (washerInUseOne === 0 && washerOneBool === true){
        hamperList.remove(washer1);
        washerOneBool = false;
    }
    if (washerInUseTwo === 0 && washerTwoBool === true){
        hamperList.remove(washer2);
        washerTwoBool = false;
    }
    if (dryerInUseOne === 0 && dryerOneBool === true){
        hamperList.remove(dryer1);
        dryerOneBool = false; 
    } 
    if (dryerInUseTwo === 0 && dryerTwoBool === true){
        hamperList.remove(dryer2);
        dryerTwoBool = false; 
    }
}
var timeChange = function(){
    washer1.myTime.string = washerTimeOne;
    washer2.myTime.string = washerTimeTwo;
    dryer1.myTime.string = dryerTimeOne;
    dryer2.myTime.string = dryerTimeTwo;
}
var creditsCon = new containerTemplate({bottom:20});

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
