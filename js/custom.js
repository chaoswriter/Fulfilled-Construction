"use strict";

var wHeight = $(window).height();
$('.mask').css('height', wHeight)
$('.mask .maskcontainer').css('margin-top', (wHeight - 180)/2).fadeIn();

$(window).load(function() {
  $('.mask').fadeOut('fast', function(){$(this).remove()});
})

$(function(){
  "use strict";

  $(window).load(function() {
    $('main>div.data.scroll').height($(window).height() - $('header').height() - $('nav ul').height() - $('footer').height() - 50 - 40 -90);
  })

  $.vegas({
    src:'images/background.jpg', fade: 1000
  });
  $.vegas('overlay', {
    src:'jquery.vegas/overlays/02.png'
  });

   $('nav ul li a').click(function(){
      var id = $(this).attr('href');
      var elem = $('main>div.data>section'+id)
      if($('main div.data').hasClass('transfade')){
        $('main div.data section').hide();
        $('main div.data section'+id).fadeIn('slow');
      }else{
        $('main div.data section').slideUp(400);
        $('main div.data section'+id).slideDown(550, function(){elem.scrollTop(0);});
      }
      $('nav ul li').removeClass('selected');
      $(this).closest('li').addClass('selected');
   });

  $('.countdown').downCount({
    date: '11/27/2015 12:00:00'
  });

   var $form = $('#mc-form');

    $('#mc-subscribe').on('click', function(event) {
        if (event)
            event.preventDefault();

        if($form.data('type') == "mailchimp")
          registerMailChimp($form);
        else
          registerByEmail($form);

    });

    function registerMailChimp($form) {

        $.ajax({
            type: $form.attr('method'),
            url: $form.attr('action'),
            data: $form.serialize(),
            cache: false,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            error: function(err) {
                $('#mc-notification').hide().html('<p class="bg-warning text-warning">Could not connect to server. Please try again later.</p>').fadeIn("slow");

            },
            success: function(data) {

                if (data.result != "success") {
                    var message = data.msg.substring(4);
                    $('#mc-notification').hide().html('<p class="bg-warning text-warning"><i class="fa fa-exclamation-triangle"></i>' + message + '</p>').fadeIn("slow");

                } else {
                    var message = data.msg.substring(4);
                    $('#mc-notification').hide().html('<p class="bg-success text-success"><i class="fa fa-envelope"></i>' + 'Awesome! We sent you a confirmation email.' + '</p>').fadeIn("slow");

                }
            }
        });
    }

    function registerByEmail($form){
      $.post( "newsletter-to-email.php", {
                               email: $('#EMAIL').val(),
                              })
         .done(function( data ) {
            $('#mc-notification').fadeIn('normal', function(){$(this).html(data)});
         });
    }

  /* validate and submit contact form */
   $.validate({
      form : '#contact-form',
      onSuccess : function() {
         $('#contact-form .btn input').attr('disabled', 'disabled').css({'cursor': 'auto', 'opacity': 0.5, 'color': '#3498db'});
         $('.btn .fa-cog').css('opacity', 1);
         $.post( "contact.php", { name: $('#name').val(),
                               email: $('#email').val(),
                               phone: $('#phone').val(),
                               message: $('#message').val()
                              })
         .done(function( data ) {
            $('.btn .fa-cog').css('opacity', 0);
            $('#contact-form .status').fadeIn('normal', function(){$(this).html(data)});
            $('#contact-form .btn input').removeAttr('disabled').css({'cursor': 'pointer', 'opacity': 1, 'color': '#f5f5f5'});
         });
         return false;
      },
   });

  $(window).load(function(){
      $("main>div.data.scroll").mCustomScrollbar({
        theme:"minimal-dark"
      });
  });
})
