$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $('#collegename').autocomplete({
        source: function( request, response ) {
            $.ajax({
                url : 'backend_process.php',
                method: "POST",
                dataType: "json",
                data: {
                   collegename: request.term,
                },
                 success: function( data ) {
                     response( $.map( data, function( item ) {
                        var code = item.split("|");
                        return {
                            label: code[0],
                            value: code[0],
                            data : item
                        }
                    }));
                }
            });
        },
        autoFocus: true,            
        minLength: 0,
        select: function( event, ui ) {
            console.log(ui);
            //var names = ui.item.data.split("|");
            var names = ui.item.data;                        
            $('#collegename').val(names[1]);
        }               
    });
    $('#spocname').autocomplete({
        source: function( request, response ) {
            $.ajax({
                url : 'backend_process.php',
                method: "POST",
                dataType: "json",
                data: {
                   spocname: request.term,
                },
                 success: function( data ) {
                     response( $.map( data, function( item ) {
                        var code = item.split("|");
                        return {
                            label: code[0],
                            value: code[0],
                            data : item
                        }
                    }));
                }
            });
        },
        autoFocus: true,            
        minLength: 0,
        select: function( event, ui ) {
            var names = ui.item.data;                        
            $('#spocname').val(names[1]);
        }               
    });
    $('#collegesearch_form').submit(function(e){
        e.preventDefault();
        var state =  $('#collegestate').val();
        var cname =  $('#collegename').val();
        var cspocname =  $('#spocname').val();
        var ccoord = $('#coordinate').val();
        $.ajax({
            type: "POST",
            dataType: "json",
            url :"backend_process.php",
            data:{clgstate:state,clgname:cname,clgspocname:cspocname,clgcoord:ccoord},
            success: function(data) {
                console.log(data);
                if(data.length != 0)
                {
                    var tot_clg = data[0].total_clg;
                    var active = data[0].active_clg;
                    var count_txt = 'Total colleges - '+tot_clg+'&nbsp;&nbsp;&nbsp;<div class="text-success" style="float:right;">Active colleges - '+active+'</div></div>';
                    $('.college_count').text('');
                    $('.college_count').append(count_txt);
                    $('#searchtablecontent').children().remove();
                    for(var i=0;i < data.length;i++)
                    {
                        console.log(data[i].logo_path);
                        if(data[i].logo_path.length == 0)
                        {
                            var collogo = "dummy_logo.png";
                        } else {
                            var collogo = data[i].logo_path;
                        }
                        if(data[i].is_active == "Y")
                        {
                            var activehtml = "<i class='glyphicon blink'>Active</i>";
                        } else {
                            var activehtml = "";
                        }
                        var tablerow = "<a href='college_homepage.php?collegeid="+data[i].collegeId+"' class='clg_list' target='_blank'>"+
                                            "<div class='col-md-1 clglist-data clg_logo_icon'><img src='http://nptel.ac.in/LocalChapter/Assets/college_logo/"+collogo+"' class='searchlogo'></div>"+
                                            "<div class='col-md-5 clglist-data'>"+data[i].College_Name+"</div>"+
                                            "<div class='col-md-1 clglist-data'>"+activehtml+"</div>"+
                                            "<div class='col-md-3 clglist-data clistcname'>"+data[i].addr1+","+data[i].addr2+"<br>"+data[i].addr3+" - "+data[i].pincode+"<br>"+data[i].stateName+"</div>"+
                                            "<div class='col-md-2 clglist-data'>"+data[i].spocname+"</div>"+
                                            //"<div class='col-md-1'>"+
                                                //"<a href='college_homepage.php?collegeid="+data[i].collegeId+"' target='_blank' class='btn btn-sm btn-info'>View</a>"+
                                            //"</div>"+
                                        "</a>";
                                        console.log(tablerow);
                        $('#searchtablecontent').append(tablerow);
                    }
                } else {
                    $('.college_count').text('No college');
                    $('#searchtablecontent').children().remove();
                   $('#searchtablecontent').append("<div class='alert alert-danger' style='color: #a94442;background-color: #f2dede;border:none;margin-top:2%'>Sorry,No Results available.</div>");
                }
            }
        });
    });
    $('.faqwell').click(function () {
        icon = $(this).find("i");
        if(icon.hasClass("glyphicon-chevron-down")){
            icon.addClass("glyphicon-chevron-up").removeClass("glyphicon-chevron-down");
        }else{
            icon.addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
        }
    }); 
});