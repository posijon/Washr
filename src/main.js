// KPR Script file
var THEME = require('themes/sample/theme');
var BUTTONS = require("controls/buttons");

var whiteSkin = new Skin( { fill:"white" } );
var blackSkin = new Skin( { fill:"black" } );

var tabStyle = new Style( { font: "bold 15px", color:"white" } );

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
	left: 0, right: 0, top: 0, bottom: $.bottom, skin: whiteSkin, active: true,
	behavior: Object.create(Container.prototype, {
		onTouchEnded: { value: function(content){
			KEYBOARD.hide();
			content.focus();
		}}
	})
}});

//containers
var machinesCon = new containerTemplate({bottom: 20});
var hamperCon = new containerTemplate({bottom:20});
var creditsCon = new containerTemplate({bottom:20});

var mainContainer = new containerTemplate({bottom:0});
mainContainer.add(hamper);
mainContainer.add(machines);
mainContainer.add(credits);
application.add(mainContainer);