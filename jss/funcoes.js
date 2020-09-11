$(document).ready(function(){
	$(window).resize(function(){
		resizeObjs()
	})
	resizeObjs()
	
	evts();

});

function evts(){
	$form = '';
	$drag = false;
	$desenhar = false;

	$('.agulhaMenu').html( $('#agulha').html() )

	$('.subMenu .optB').off().on('click',function(){
		$cm = $(this).attr('data-attr').split('_')[0];
		$quad = $(this).attr('data-attr').split('_')[1];
		clearBastidor();
	})
	$('.subMenu .optF').off().on('click',function(){
		$form = $(this).attr('data-attr');
		if( $('#bast').length > 0 ){
			$('#bast').attr('class',$form);
		}
	})
	$cor = '#000';
	$(' .subMenu .optC').removeClass('on').off().on('click',function(){
		$cor = $(this).css('background-color');
		$('.pathLinha').attr('fill', $cor );
		
		$(' .subMenu .optC').removeClass('on');
		$(this).addClass('on');
	})
	
	$('.subMenu .optFnt input').off().on('change keyup keydown',function(){
		var val = $(this).val().toUpperCase().match(/[A-Z]/g);
		$(this).val(val);
	})
	$arLetras = {
		a:[ '0XX0','X00X','XXXX','X00X','X00X' ],
		b:[ 'XXXX','X00X','XXX ','X00X','XXXX' ],
		c:[ 'XXXX','X000','X000','X000','XXXX' ],
	}
	
	$('.subMenu .optFnt .btOk').off().on('click',function(){
		if($('#bast').length > 0){
			var lt = $(this).parent().find('input').val().toLowerCase();;
			if(lt != ''){
				var ar = $arLetras[lt];
				var objLetra = $('<div class="letraDrag"></div>');
				objLetra.width( ar[0].length*15 ).height( ar.length*15 );
				for(var i in ar){
					for(var j in ar[i]){
						var ponto = $('<div class="ponto"></div>');
						if(ar[i][j] == 'X'){
							ponto.css('background-color',$cor);
						}
						objLetra.append(ponto);
					}
				}
				$('#bast .contDrag').append(objLetra);
			}
			evtDragLetra();
		}
	})

	$('.btAgulha').off().on('click',function(){
		$(this).toggleClass('on');
		if($(this).hasClass('on')){
			$desenhar = true;
			$('#agulha').show();
		} else {
			$desenhar = false;
			$('#agulha').hide();
		}
	})

	$('.btMenu').off().on('click',function(){
		$('#menu').toggleClass('on');
	})
	
	$('#agulha').hide();
	$('#content').off().on('mousemove touchmove',function(evt){
		if($drag){
			var scale = $('#bast').attr('data-scale');
			if(evt.clientX || evt.clientX === 0){
				$xMouse = (evt.clientX - $drag.parent().offset().left) /scale;
				$yMouse = (evt.clientY - $drag.parent().offset().top)  /scale;
			} else {
				$xMouse = (evt.originalEvent.touches[0].pageX - $drag.parent().offset().left)/scale;
				$yMouse = (evt.originalEvent.touches[0].pageY - $drag.parent().offset().top) /scale;
			}
			var x = Math.min($quad*15-$drag.width() , Math.max(0, parseInt( ($xMouse - $drag.width()/2)/15 )*15 ) );
			var y = Math.min($quad*15-$drag.height(), Math.max(0, parseInt( ($yMouse- $drag.height()/2)/15 )*15 ) );
			$drag.css({ left: x , top: y });
		}

		if(evt.clientX || evt.clientX === 0){
			$xMouse = (evt.clientX - $('#content').offset().left) ;
			$yMouse = (evt.clientY - $('#content').offset().top) ;
		} else {
			$xMouse = (evt.originalEvent.touches[0].pageX - $('#content').offset().left);
			$yMouse = (evt.originalEvent.touches[0].pageY - $('#content').offset().top) ;
		}

		$('#agulha').css({ left:$xMouse , top:$yMouse });
	})
	$painting = false;

	$('#content').on('mouseup touchend',function(){
		$painting = false;
		$drag = false;
	})
}

function evtDragLetra(){
	$('.letraDrag').off().on('mousedown touchstart',function(evt){
		$drag = $(this);
		evt.preventDefault();
	})
}

function clearBastidor(){
	if($quad){

		$('#stage').html('<div id="bast"></div>');
		$('#bast').append('<div class="tamanho">'+$cm+'cm X '+$cm+'cm</div> <div class="cont"></div> <div class="contDrag"></div>');
		for(var i =0; i < $quad*$quad; i++  ){
			$('#bast .cont').prepend('<div class="qd"></div>');
			if( i < $quad){
				var lV = $('<div class="linhaV"></div>');
				var lH = $('<div class="linhaH"></div>');
				lV.css({ left:15*i });
				lH.css({ top:15*i });
				$('#bast .cont').append(lV);
				$('#bast .cont').append(lH);

			}
		}
		$('#bast').css({
			width: ($quad*15), 
			height: ($quad*15), 
			marginLeft: ($quad*15)/2 *-1, 
			marginTop: ($quad*15)/2 *-1, 
		});
		if($form){
			$('#bast').attr('class',$form);
		}
		resizeObjs();

		$('#bast .qd').off().on('mouseover ',function(){
			if($painting){
				$(this).css({'background-color':$cor});
			}
		})
		$('#bast').off().on('mousedown touchstart',function(){
			if($desenhar) $painting = true;
		})
		
	}
}

function resizeObjs(){
	var s = Math.min( $('#content').width() , $('#content').height() );
	$('#stage').width(s).height(s);

	if( $('#bast').length > 0){
		var max = ( s*.9 )/$('#bast').width();
		$('#bast').css('transform','scale('+ Math.min(1,max) +')').attr('data-scale', Math.min(1,max));
	}
}


function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
