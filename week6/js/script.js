$(document).ready(function(){
    console.log("check");
   $(document).mousemove(function(e){
      $('#status').html(e.pageX +', '+ e.pageY);

      $(".box").css("width", e.pageX);
      $(".box").css("width", e.pagey);
   });
})