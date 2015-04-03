(function($,window){"use strict";$.formUtils.addValidator({name:"spamcheck",validatorFunction:function(val,$el,config){var attr=$el.valAttr("captcha");return attr===val},errorMessage:"",errorMessageKey:"badSecurityAnswer"});$.formUtils.addValidator({name:"confirmation",validatorFunction:function(value,$el,config,language,$form){var conf="",confInputName=$el.valAttr("confirm")||$el.attr("name")+"_confirmation",confInput=$form.find('input[name="'+confInputName+'"]').eq(0);if(confInput){conf=confInput.val()}else{console.warn('Could not find an input with name "'+confInputName+'"')}return value===conf},errorMessage:"",errorMessageKey:"notConfirmed"});$.formUtils.addValidator({name:"creditcard",validatorFunction:function(value,$el,config,language,$form){var cards={amex:[15,15],diners_club:[14,14],cjb:[16,16],laser:[16,19],visa:[16,16],mastercard:[16,16],maestro:[12,19],discover:[16,16]},allowing=$.split($el.valAttr("allowing")||"");if(allowing.length>0){var hasValidLength=false;$.each(allowing,function(i,cardName){if(cardName in cards){if(value.length>=cards[cardName][0]&&value.length<=cards[cardName][1]){hasValidLength=true;return false}}else{console.warn('Use of unknown credit card "'+cardName+'"')}});if(!hasValidLength)return false}if(value.replace(new RegExp("[0-9]","g"),"")!==""){return false}var checkSum=0;$.each(value.split("").reverse(),function(i,digit){digit=parseInt(digit,10);if(i%2===0){checkSum+=digit}else{digit*=2;if(digit<10){checkSum+=digit}else{checkSum+=digit-9}}});return checkSum%10===0},errorMessage:"",errorMessageKey:"badCreditCard"});$.formUtils.addValidator({name:"cvv",validatorFunction:function(val){return val.replace(/[0-9]/g,"")===""&&(val+"").length==3},errorMessage:"",errorMessageKey:"badCVV"});$.formUtils.addValidator({name:"strength",validatorFunction:function(val,$el,conf){var requiredStrength=$el.valAttr("strength");if(requiredStrength&&requiredStrength>3)requiredStrength=3;return $.formUtils.validators.validate_strength.calculatePasswordStrength(val)>=requiredStrength},errorMessage:"",errorMessageKey:"badStrength",calculatePasswordStrength:function(password){if(password.length<4){return 0}var score=0;var checkRepetition=function(pLen,str){var res="";for(var i=0;i<str.length;i++){var repeated=true;for(var j=0;j<pLen&&j+i+pLen<str.length;j++){repeated=repeated&&str.charAt(j+i)==str.charAt(j+i+pLen)}if(j<pLen){repeated=false}if(repeated){i+=pLen-1;repeated=false}else{res+=str.charAt(i)}}return res};score+=password.length*4;score+=(checkRepetition(1,password).length-password.length)*1;score+=(checkRepetition(2,password).length-password.length)*1;score+=(checkRepetition(3,password).length-password.length)*1;score+=(checkRepetition(4,password).length-password.length)*1;if(password.match(/(.*[0-9].*[0-9].*[0-9])/)){score+=5}if(password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)){score+=5}if(password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){score+=10}if(password.match(/([a-zA-Z])/)&&password.match(/([0-9])/)){score+=15}if(password.match(/([!,@,#,$,%,^,&,*,?,_,~])/)&&password.match(/([0-9])/)){score+=15}if(password.match(/([!,@,#,$,%,^,&,*,?,_,~])/)&&password.match(/([a-zA-Z])/)){score+=15}if(password.match(/^\w+$/)||password.match(/^\d+$/)){score-=10}if(score<0){score=0}if(score>100){score=100}if(score<20){return 0}else if(score<40){return 1}else if(score<=60){return 2}else{return 3}},strengthDisplay:function($el,options){var config={fontSize:"12pt",padding:"4px",bad:"Very bad",weak:"Weak",good:"Good",strong:"Strong"};if(options){$.extend(config,options)}$el.bind("keyup",function(){var val=$(this).val();var $parent=typeof config.parent=="undefined"?$(this).parent():$(config.parent);var $displayContainer=$parent.find(".strength-meter");if($displayContainer.length==0){$displayContainer=$("<span></span>");$displayContainer.addClass("strength-meter").appendTo($parent)}if(!val){$displayContainer.hide()}else{$displayContainer.show()}var strength=$.formUtils.validators.validate_strength.calculatePasswordStrength(val);var css={background:"pink",color:"#FF0000",fontWeight:"bold",border:"red solid 1px",borderWidth:"0px 0px 4px",display:"inline-block",fontSize:config.fontSize,padding:config.padding};var text=config.bad;if(strength==1){text=config.weak}else if(strength==2){css.background="lightyellow";css.borderColor="yellow";css.color="goldenrod";text=config.good}else if(strength>=3){css.background="lightgreen";css.borderColor="darkgreen";css.color="darkgreen";text=config.strong}$displayContainer.css(css).text(text)})}});var requestServer=function(serverURL,$element,val,conf,callback){$.ajax({url:serverURL,type:"POST",cache:false,data:$element.attr("name")+"="+val,dataType:"json",error:function(error){alert("Server validation failed due to: "+error.statusText);if(window.JSON&&window.JSON.stringify){alert(window.JSON.stringify(error))}},success:function(response){if(response.valid){$element.valAttr("backend-valid","true")}else{$element.valAttr("backend-invalid","true");if(response.message)$element.attr(conf.validationErrorMsgAttribute,response.message);else $element.removeAttr(conf.validationErrorMsgAttribute)}if(!$element.valAttr("has-keyup-event")){$element.valAttr("has-keyup-event","1").bind("keyup",function(evt){if(evt.keyCode!=9&&evt.keyCode!=16){$(this).valAttr("backend-valid",false).valAttr("backend-invalid",false).removeAttr(conf.validationErrorMsgAttribute)}})}callback()}})},disableFormSubmit=function(){return false};$.formUtils.addValidator({name:"server",validatorFunction:function(val,$el,conf,lang,$form){var backendValid=$el.valAttr("backend-valid"),backendInvalid=$el.valAttr("backend-invalid"),serverURL=document.location.href;if($el.valAttr("url")){serverURL=$el.valAttr("url")}else if("serverURL"in conf){serverURL=conf.backendUrl}if(backendValid)return true;else if(backendInvalid)return false;else if($.formUtils.eventType=="keyup")return null;if($.formUtils.isValidatingEntireForm){$form.bind("submit",disableFormSubmit).addClass("validating-server-side").addClass("on-blur");$el.addClass("validating-server-side");requestServer(serverURL,$el,val,conf,function(){$form.removeClass("validating-server-side").removeClass("on-blur").get(0).onsubmit=function(){};$form.unbind("submit",disableFormSubmit);$el.removeClass("validating-server-side");$el.valAttr("value-length",val.length);$form.trigger("submit")});$.formUtils.haltValidation=true;return null}else{$form.addClass("validating-server-side");$el.addClass("validating-server-side");requestServer(serverURL,$el,val,conf,function(){$form.removeClass("validating-server-side");$el.removeClass("validating-server-side");$el.trigger("blur")});return null}},errorMessage:"",errorMessageKey:"badBackend",validateOnKeyUp:false});$.fn.displayPasswordStrength=function(conf){new $.formUtils.validators.validate_strength.strengthDisplay(this,conf);return this}})(jQuery,window);
