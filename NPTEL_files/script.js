$(document).ready(function(){
    console.log(window.innerWidth);
    $('[data-toggle="tooltip"]').tooltip();
    var selecteddiscipline = '';
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        selecteddiscipline = value;
    });
    var selectedcoursetype = '';
    var selectedinstitute = '';
    var entersearch = '';
    var keysearch = '';
    /****** To set only a single check box will be checked on each list******/
    $('#discipline .ccheck').click(function(evt){
        var checkbox = $("#discipline .ccheck:checkbox:checked");
        $('#discipline .ccheck').not(this).prop('checked', false);
    });

    $('#contenttype .ccheck').click(function(evt){
        var checkbox = $("#contenttype .ccheck:checkbox:checked");
        $('#contenttype .ccheck').not(this).prop('checked', false);
    });
    
    $('#institute .ccheck').click(function(evt){
        var checkbox = $("#institute .ccheck:checkbox:checked");
        $('#institute .ccheck').not(this).prop('checked', false);
    });
    /*********** scrol to top *************/
    $('#toTop').fadeOut();
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('#toTop').fadeIn();
        } else {
            $('#toTop').fadeOut();
        }
    });
    $('#toTop').click(function(){ 
       $("html, body").animate({ scrollTop: 0 }, 1000); 
       return false; 
    });
    /******** end of scroll to top *********/

    /******** code fo showing suggession oh typing textbox in course page *********/
    $( "#cssearch" ).keyup(function() {
        var term = $( "#cssearch" ).val();
        if(term.length > 2)
        {
            $( "#suglist" ).children('li').remove();
            $( "#suglist" ).children('.loader').remove();
            $( "#suglist" ).append('<div class="loader"><center><img src="./newstyles/images/loader.gif" style="width:25px;height:25px;"></center></div>');
            $( "#menu-container" ).slideDown();
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data:{searchterm:term},
                success: function(data) {
                    console.log(data);
                    var availableTags = '';
                    if(data.subject && Object.keys(data.subject).length > 0)
                    {
                        var subdata = data.subject;
                        for(var i = 0; i<subdata.length;i++)
                        {
                            availableTags = availableTags + '<li class="slist" value="'+subdata[i].subjectName+'" type="coursename">'+subdata[i].subjectName+ ' - <i><b>Course</b></i></li>';
                        }
                    }
                    if(data.professor && Object.keys(data.professor).length > 0)
                    {
                        var profdata = data.professor;
                        for(var i = 0; i<profdata.length;i++)
                        {
                            availableTags = availableTags + '<li class="slist" value="'+profdata[i].coordinatorName+'" type="profname">'+profdata[i].coordinatorName+ ' - <i><b>Professor</b></i></li>';
                        }
                    }
                    if(data.institute && Object.keys(data.institute).length > 0)
                    {
                        var instdata = data.institute;
                        for(var i = 0; i<instdata.length;i++)
                        {
                            availableTags = availableTags + '<li class="slist" value="'+instdata[i].Institute+'" type="instname">'+instdata[i].Institute+ ' - <i><b>institute</b></i></li>';
                        }
                    }
                    if(availableTags.length > 0)
                    {
                        $( "#suglist" ).children('li').remove();
                        $( "#suglist" ).children('.loader').remove();
                        $( "#suglist" ).append(availableTags);
                        $( "#menu-container" ).slideDown();
                    }
                }
                    
            });
        } else {
            $( "#menu-container" ).hide();
        }
    });
    /******** end of suggession list code *********/

    /******** code for when user type on textbox and click enter in course page *********/
    $('#cssearch').keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $('#discipline .ccheck').prop('checked', false);
            $('#contenttype .ccheck').prop('checked', false);
            $('#institute .ccheck').prop('checked', false);
            var term = $(this).val();
            if(term.length > 2)
            {
                entersearch = term;
                keysearch = '';
                $( "#menu-container" ).hide();
                $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
                $('.resultlist').children().remove();
                $('.overallcourse').children().remove();
                $('#cssearch').blur();
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url :"server.php",
                    data:{entersearch: term},
                    success: function(data) {
                        var tot = data.length;
                        if(data.length == undefined || data.result == 'null')
                        {
                            $('.pagination').children().remove();
                           // setTimeout(function(){
                                $('#cssearch').val(term);
                                $('.overallcourse').children().remove()
                                $('.resultlist').children().remove();
                                $('.loader').remove();
                                $( "#menu-container" ).hide();
                                $('.overallcourse').append('<div class="nodata">Sorry, this search criteria didn&#8217;t have any results</div>');
                            //},1000); 
                        } else {
                            $('.overallcourse').children().remove();
                            $( ".resultlist" ).append("<span class='text-success'> Search results for '"+term+"'</span><hr>");
                        /************ code for pagination **************/
                            var pg = data[0].pages;
                            $('.pagination').children().remove();
                            if(pg > 5)
                                $( ".pagination" ).prepend('<div value="prev" class="pg_prev">Prev</div>');
                            for(i = 1;i<=pg;i++)
                            {
                                $('.pagination').append('<li value="'+i+'" class="page">'+i+'</li>'); 
                            }
                            pageSize = 5;
                            var j = 1;
                            showPage = function(page) {
                                console.log(page);
                                $(".page").hide();
                                $(".page").each(function(n) {
                                    
                                    if (n >= pageSize * (page - 1) && n < pageSize * page)
                                        $(this).show();
                                });        
                            }
                            showPage(j);
                            if(pg > 5)
                                $('.pagination').append('<div value="next" class="pg_next">Next</div>');
                            $(".pagination li:first").addClass("active");
                            $(".pg_prev").click(function() {
                                $(".pg_next").removeClass("active");
                                $(this).addClass("active");
                                if (j != 1) {
                                    showPage(--j);
                                }
                            });
                            $(".pg_next").click(function() {
                                $(".pg_prev").removeClass("active");
                                $(this).addClass("active");
                                if (j < ($('.page').length)/5) {

                                    showPage(++j);
                                }    
                            });
                            /************************** end of pagination content *************/
                            for(var i=0;i < tot;i++)
                            {
                                csname = data[i].subjectName;
                                csco = data[i].coordinatorName;
                                csins = data[i].Institute;
                                csdisp = data[i].disciplineName;
                                csdid = data[i].DisciplineId;
                                cstype = data[i].ContentType;
                                csid = data[i].subjectId;
                                csyid = '';
                                cscontent = data[i].contents;
                                cssyllabus = data[i].syllabusavailability;
                                csprodate = data[i].productionDate;
                                csdown = data[i].download;
                                csask = data[i].faq;
                                cscap = data[i].ccap;
                                csbook = data[i].cbook;
                                if(data[i].youtubeid != undefined && data[i].youtubeid.length > 0)
                                {
                                    csyid = data[i].youtubeid;
                                }
                                $.post("individualcourse.php",
                                {
                                    name: csname,
                                    disp: csdisp,
                                    coord: csco,
                                    ins:csins,
                                    count: i,
                                    disid: csdid,
                                    type: cstype,
                                    id: csid,
                                    yid: csyid,
                                    content:cscontent,
                                    syllabus: cssyllabus,
                                    prodate: csprodate,
                                    download: csdown,
                                    ask: csask,
                                    ccap: cscap,
                                    cbook: csbook
                                },
                                function(indfile,status){
                                    $("#overallcs").hide();
                                    $("#defaultlist").remove();
                                    //setTimeout(function(){
                                        $("#overallcs").append(indfile);
                                        $("#overallcs").show();
                                        $('.loader').remove();
                                        $( "#menu-container" ).hide();
                                    //},1000);
                                });
                            }
                        }
                    }
                });
            }
        }
    });
    /******** end of textbox enter code *********/

    /******** code for when user click on the suggesion list on typeing searchbox in course page *********/
    $( ".suggesionlist" ).on( "click", "li", function() {
        $('#discipline .ccheck').prop('checked', false);
        $('#contenttype .ccheck').prop('checked', false);
        $('#institute .ccheck').prop('checked', false);
        $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
        selecteddiscipline = '';
        selectedcoursetype = '';
        selectedinstitute = '';
        entersearch = '';
        keysearch = '';
        var lname = $(this).attr('value');
        var ltype = $(this).attr('type');
        $( "#cssearch" ).val(lname);
        $( "#menu-container" ).hide();
        $.ajax({
            type: "POST",
            dataType: "json",
            url :"server.php",
            data:{search:lname,type:ltype},
            success: function(data) {
                console.log(data);
                var tot = data.length;
                if(data.length == undefined || data.result == 'null')
                {
                    //setTimeout(function(){
                        $('.overallcourse').children().remove();
                        $('.resultlist').children().remove();
                        $('.pagination').children().remove();
                        $('.loader').remove();
                        $('.overallcourse').append('<div class="nodata">Sorry, this search criteria didn&#44;t have any results</div>');
                //},1000);
                } else {
                    $('.overallcourse').children().remove();
                    $('.resultlist').children().remove();
                    $( ".resultlist" ).append("<span class='text-success'> Search results for '"+lname+"'</span><hr>");
                    $('.pagination').children().remove();
                    for(var i=0;i < tot;i++)
                    {
                        csname = data[i].subjectName;
                        csco = data[i].coordinatorName;
                        csins = data[i].Institute;
                        csdisp = data[i].disciplineName;
                        csdid = data[i].DisciplineId;
                        cstype = data[i].ContentType;
                        csid = data[i].subjectId;
                        cscontent = data[i].contents;
                        cssyllabus = data[i].syllabusavailability;
                        csprodate = data[i].productionDate;
                        csdown = data[i].download;
                        csask = data[i].faq;
                        cscap = data[i].ccap;
                        csbook = data[i].cbook;
                        $.post("individualcourse.php",
                        {
                            name: csname,
                            disp: csdisp,
                            coord: csco,
                            ins:csins,
                            count: i,
                            disid: csdid,
                            type: cstype,
                            id: csid,
                            content:cscontent,
                            syllabus: cssyllabus,
                            prodate: csprodate,
                            download: csdown,
                            ask: csask,
                            ccap: cscap,
                            cbook: csbook
                        },
                        function(indfile,status){
                            $("#overallcs").hide();
                            $("#defaultlist").remove();
                            //setTimeout(function(){
                                $("#overallcs").append(indfile);
                                $("#overallcs").show();
                                $('.loader').remove();
                            //},1000);
                        });
                    }
                }
            }
        });
    });
    /******** end of suggesion list click *********/

    /******** code for pagination click *********/
    $( ".pagination" ).on( "click", "li", function() {
        $('.loader').remove();
        $("#overallcs").hide();
        $('.overallcourse').children().remove();
        $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
        pgnum = $(this).val();
        $(".pagination li").removeClass("active");
        $(this).addClass("active");
        var postdata = new Object();
        if(entersearch.length > 0)
        {
            postdata["entersearch"] = entersearch; 
        } else if(keysearch.length > 0){
            postdata["keysearch"] = keysearch;
            postdata["offset"] = pgnum; 
        } else {
            if(selecteddiscipline.length > 0)
            {
                postdata["search_dispid"] = selecteddiscipline;
            }
            if(selectedcoursetype.length > 0)
            {
                postdata["search_ctype"] = selectedcoursetype;
            }
            if(selectedinstitute.length > 0)
            {
                postdata["search_ins"] = selectedinstitute;
            }
        }
            postdata["offset"] = pgnum;
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data:postdata,
                success: function(data) {
                    var tot = data.length;
                    if(data.length == undefined || data.result == 'null')
                    {

                        //setTimeout(function(){
                            $('.overallcourse').children().remove();
                            $('.loader').remove();
                        //},1000);
                    } else {
                        for(var i=0;i < tot;i++)
                        {
                            csname = data[i].subjectName;
                            csco = data[i].coordinatorName;
                            csins = data[i].Institute;
                            csdisp = data[i].disciplineName;
                            csdid = data[i].DisciplineId;
                            cstype = data[i].ContentType;
                            csid = data[i].subjectId;
                            csyid = '';
                            cscontent = data[i].contents;
                            cssyllabus = data[i].syllabusavailability;
                            csprodate = data[i].productionDate;
                            csdown = data[i].download;
                            csask = data[i].faq;
                            cscap = data[i].ccap;
                            csbook = data[i].cbook;
                            cslecname = data[i].lectureName;
                            cslecid = data[i].lectureId;
                            if(data[i].youtubeid != undefined && data[i].youtubeid.length > 0)
                            {
                                csyid = data[i].youtubeid;
                            }
                            $.post("individualcourse.php",
                            {
                                name: csname,
                                disp: csdisp,
                                coord: csco,
                                ins:csins,
                                count: i,
                                disid: csdid,
                                type: cstype,
                                id: csid,
                                yid:csyid,
                                content:cscontent,
                                syllabus: cssyllabus,
                                prodate: csprodate,
                                download: csdown,
                                ask: csask,
                                ccap: cscap,
                                cbook:csbook,
                                lecname: cslecname,
                                lecid: cslecid
                            },
                            function(indfile,status){
                                $("#defaultlist").remove();
                                //setTimeout(function(){
                                    $("#overallcs").append(indfile);
                                    $("#overallcs").show();
                                    $('.loader').remove();
                                //},1000);
                            });
                        }
                    }
                }
            });
    });
    /******** end of pagination click code *********/
    /******************* code for check and uncheck List by Discipline *********************/
    $('#discipline .ccheck').change(function(evt){
        $('.loader').remove();
        $('.overallcourse').children().remove();
        $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
        var dispid = $(this).val();
        var tag='';
        if (this.checked) {
            $('#cssearch').val('');
            entersearch = '';
            keysearch = '';
            var dispname = $(this).next().text();
            tag = '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+dispname+'</div>';
            selecteddiscipline = dispid;
            var postdata = 'search_dispid=' + selecteddiscipline;
            if(selectedcoursetype.length > 0)
            {
                postdata = postdata + '&search_ctype=' + selectedcoursetype;
                tag = tag +'<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+selectedcoursetype+'Courses</div>';
            }
            if(selectedinstitute.length > 0)
            {
                postdata = postdata + '&search_ins=' + selectedinstitute;
                tag = tag +'<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+selectedinstitute+'</div>';
            }
            console.log(postdata);
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data:postdata,
                success: function(data) {
                    var tot = data.length;
                    if(data.length == undefined || data.result == 'null')
                    {
                        $('.pagination').children().remove();
                        //setTimeout(function(){
                            $('.overallcourse').children().remove();
                            $('.resultlist').children().remove();
                            $('.loader').remove();
                            $('.overallcourse').append('<div class="nodata">Sorry, this search criteria didn&#8217;t have any results</div>');
                        //},1000);
                    } else {
                    /************ code for pagination **************/
                        var pg = data[0].pages;
                        $('.pagination').children().remove();
                        if(pg > 5)
                            $( ".pagination" ).prepend('<div value="prev" class="pg_prev">Prev</div>');
                        for(i = 1;i<=pg;i++)
                        {
                            $('.pagination').append('<li value="'+i+'" class="page">'+i+'</li>'); 
                        }
                        pageSize = 5;
                        var j = 1;
                        showPage = function(page) {
                            console.log(page);
                            $(".page").hide();
                            $(".page").each(function(n) {
                                
                                if (n >= pageSize * (page - 1) && n < pageSize * page)
                                    $(this).show();
                            });        
                        }
                        showPage(j);
                        if(pg > 5)
                            $('.pagination').append('<div value="next" class="pg_next">Next</div>');
                        $(".pagination li:first").addClass("active");
                        $(".pg_prev").click(function() {
                            $(".pg_next").removeClass("active");
                            $(this).addClass("active");
                            if (j != 1) {
                                showPage(--j);
                            }
                        });
                        $(".pg_next").click(function() {
                            $(".pg_prev").removeClass("active");
                            $(this).addClass("active");
                            if (j < ($('.page').length)/5) {

                                showPage(++j);
                            }    
                        });
                        /************************** end of pagination content *************/
                        $('.resultlist').children().remove();
                        $('.resultlist').append(tag);
                        for(var i=0;i < tot;i++)
                        {
                            csname = data[i].subjectName;
                            csco = data[i].coordinatorName;
                            csins = data[i].Institute;
                            csdisp = data[i].disciplineName;
                            csdid = data[i].DisciplineId;
                            cstype = data[i].ContentType;
                            csid = data[i].subjectId;
                            csyid = '';
                            cscontent = data[i].contents;
                            cssyllabus = data[i].syllabusavailability;
                            csprodate = data[i].productionDate;
                            csdown = data[i].download;
                            csask = data[i].faq;
                            cscap = data[i].ccap;
                            csbook = data[i].cbook;
                            if(data[i].youtubeid != undefined && data[i].youtubeid.length > 0)
                            {
                                csyid = data[i].youtubeid;
                            }
                            $.post("individualcourse.php",
                            {
                                name: csname,
                                disp: csdisp,
                                coord: csco,
                                ins:csins,
                                count: i,
                                disid: csdid,
                                type: cstype,
                                id: csid,
                                yid:csyid,
                                content:cscontent,
                                syllabus: cssyllabus,
                                prodate: csprodate,
                                download: csdown,
                                ask: csask,
                                ccap: cscap,
                                cbook: csbook
                            },
                            function(indfile,status){
                                $("#overallcs").hide();
                                $("#defaultlist").remove();
                                //setTimeout(function(){
                                    $("#overallcs").append(indfile);
                                    $("#overallcs").show();
                                    $('.loader').remove();
                                //},1000);
                            });
                        }
                    }
                }
            });
        } else {
            $('.loader').remove();
            $('.overallcourse').children().remove();
            $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
            selecteddiscipline = '';
            var postdata = new Object();
            if(selectedcoursetype.length > 0)
            {
                postdata["search_ctype"] = selectedcoursetype;
                tag = tag +'<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+selectedcoursetype+'Courses</div>';
            }
            if(selectedinstitute.length > 0)
            {
                postdata["search_ins"] = selectedinstitute;
                tag = tag +'<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+selectedinstitute+'</div>';
            }
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data: postdata,
                success: function(data) {
                    var tot = data.length;
                    if(data.length == undefined || data.result == 'null')
                    {
                        $('.pagination').children().remove();
                        //setTimeout(function(){
                            $('.overallcourse').children().remove();
                            $('.resultlist').children().remove();
                            $('.loader').remove();
                            $('.overallcourse').append('<div class="nodata">Sorry, this search criteria didn&#8217;t have any results</div>');
                        //},1000);
                    } else {
                        /************ code for pagination **************/
                        var pg = data[0].pages;
                        $('.pagination').children().remove();
                        if(pg > 5)
                            $( ".pagination" ).prepend('<div value="prev" class="pg_prev">Prev</div>');
                        for(i = 1;i<=pg;i++)
                        {
                            $('.pagination').append('<li value="'+i+'" class="page">'+i+'</li>'); 
                        }
                        pageSize = 5;
                        var j = 1;
                        showPage = function(page) {
                            console.log(page);
                            $(".page").hide();
                            $(".page").each(function(n) {
                                
                                if (n >= pageSize * (page - 1) && n < pageSize * page)
                                    $(this).show();
                            });        
                        }
                        showPage(j);
                        if(pg > 5)
                            $('.pagination').append('<div value="next" class="pg_next">Next</div>');
                        $(".pagination li:first").addClass("active");
                        $(".pg_prev").click(function() {
                            $(".pg_next").removeClass("active");
                            $(this).addClass("active");
                            if (j != 1) {
                                showPage(--j);
                            }
                        });
                        $(".pg_next").click(function() {
                            $(".pg_prev").removeClass("active");
                            $(this).addClass("active");
                            if (j < ($('.page').length)/5) {

                                showPage(++j);
                            }    
                        });
                        /************************** end of pagination content *************/
                        $('.resultlist').children().remove();
                        $('.resultlist').append(tag);
                        for(var i=0;i < tot;i++)
                        {
                            csname = data[i].subjectName;
                            csco = data[i].coordinatorName;
                            csins = data[i].Institute;
                            csdisp = data[i].disciplineName;
                            csdid = data[i].DisciplineId;
                            cstype = data[i].ContentType;
                            csid = data[i].subjectId;
                            csyid = '';
                            cscontent = data[i].contents;
                            cssyllabus = data[i].syllabusavailability;
                            csprodate = data[i].productionDate;
                            csdown = data[i].download;
                            csask = data[i].faq;
                            cscap = data[i].ccap;
                            csbook = data[i].cbook;
                            if(data[i].youtubeid != undefined && data[i].youtubeid.length > 0)
                            {
                                csyid = data[i].youtubeid;
                            }
                            $.post("individualcourse.php",
                            {
                                name: csname,
                                disp: csdisp,
                                coord: csco,
                                ins:csins,
                                count: i,
                                disid: csdid,
                                type: cstype,
                                id: csid,
                                yid:csyid,
                                content:cscontent,
                                syllabus: cssyllabus,
                                prodate: csprodate,
                                download: csdown,
                                ask: csask,
                                ccap: cscap,
                                cbook: csbook
                            },
                            function(indfile,status){
                                $("#overallcs").hide();
                                $("#defaultlist").remove();
                                //setTimeout(function(){
                                    $("#overallcs").append(indfile);
                                    $("#overallcs").show();
                                    $('.loader').remove();
                                //},1000);
                            });
                        }
                    }
                }
            });
        }
    });
    /******************* end of List by Discipline *********************/

    /******************* code for check and uncheck List by Content Type *********************/
    $('#contenttype .ccheck').change(function(evt){
        $('.overallcourse').children().remove();
        $('.loader').remove();
        $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
        var tag = '';
        var type = $(this).val();
        if (this.checked) {
            $('#cssearch').val('');
            entersearch = '';
            keysearch = '';
            var typename = $(this).next().text();
            selectedcoursetype= type;
            var postdata = 'search_ctype=' + selectedcoursetype;
            tag = '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+typename+'</div>';
            if(selecteddiscipline.length > 0)
            {
                postdata = postdata + '&search_dispid=' + selecteddiscipline;
            }
            if(selectedinstitute.length > 0)
            {
                postdata = postdata + '&search_ins=' + selectedinstitute;
                tag = tag + '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+selectedinstitute+'</div>';
            }
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data:postdata,
                success: function(data) {
                    var tot = data.length;
                    if(data.length == undefined || data.result == 'null')
                    {
                        $('.pagination').children().remove();
                        //setTimeout(function(){
                            $('.overallcourse').children().remove();
                            $('.resultlist').children().remove();
                            $('.loader').remove();
                            $('.overallcourse').append('<div class="nodata">Sorry, this search criteria didn&#8217;t have any results</div>');
                        //},1000);
                    } else {
                        /************ code for pagination **************/
                        var pg = data[0].pages;
                        $('.pagination').children().remove();
                        if(pg > 5)
                            $( ".pagination" ).prepend('<div value="prev" class="pg_prev">Prev</div>');
                        for(i = 1;i<=pg;i++)
                        {
                            $('.pagination').append('<li value="'+i+'" class="page">'+i+'</li>'); 
                        }
                        pageSize = 5;
                        var j = 1;
                        showPage = function(page) {
                            console.log(page);
                            $(".page").hide();
                            $(".page").each(function(n) {
                                
                                if (n >= pageSize * (page - 1) && n < pageSize * page)
                                    $(this).show();
                            });        
                        }
                        showPage(j);
                        if(pg > 5)
                            $('.pagination').append('<div value="next" class="pg_next">Next</div>');
                        $(".pagination li:first").addClass("active");
                        $(".pg_prev").click(function() {
                            $(".pg_next").removeClass("active");
                            $(this).addClass("active");
                            if (j != 1) {
                                showPage(--j);
                            }
                        });
                        $(".pg_next").click(function() {
                            $(".pg_prev").removeClass("active");
                            $(this).addClass("active");
                            if (j < ($('.page').length)/5) {

                                showPage(++j);
                            }    
                        });
                        /************************** end of pagination content *************/
                        if(selecteddiscipline.length > 0)
                        {
                            tag = '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+data[0].disciplineName+'</div>'+tag;
                        }
                        $('.resultlist').children().remove();
                        $('.resultlist').append(tag);
                        for(var i=0;i < tot;i++)
                        {
                            csname = data[i].subjectName;
                            csco = data[i].coordinatorName;
                            csins = data[i].Institute;
                            csdisp = data[i].disciplineName;
                            csdid = data[i].DisciplineId;
                            cstype = data[i].ContentType;
                            csid = data[i].subjectId;
                            csyid = '';
                            cscontent = data[i].contents;
                            cssyllabus = data[i].syllabusavailability;
                            csprodate = data[i].productionDate;
                            csdown = data[i].download;
                            csask = data[i].faq;
                            cscap = data[i].ccap;
                            csbook = data[i].cbook;
                            if(data[i].youtubeid != undefined && data[i].youtubeid.length > 0)
                            {
                                csyid = data[i].youtubeid;
                            }
                            $.post("individualcourse.php",
                            {
                                name: csname,
                                disp: csdisp,
                                coord: csco,
                                ins:csins,
                                count: i,
                                disid: csdid,
                                type: cstype,
                                id: csid,
                                yid: csyid,
                                content:cscontent,
                                syllabus: cssyllabus,
                                prodate: csprodate,
                                download: csdown,
                                ask: csask,
                                ccap: cscap,
                                cbook: csbook
                            },
                            function(indfile,status){
                                $("#overallcs").hide();
                                $("#defaultlist").remove();
                                //setTimeout(function(){
                                    $("#overallcs").append(indfile);
                                    $("#overallcs").show();
                                    $('.loader').remove();
                                //},1000);
                            });
                        }
                    }
                }
            });
        } else {
            selectedcoursetype = '';
            $('.overallcourse').children().remove();
            $('.loader').remove();
            $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
            var postdata = new Object();
            if(selecteddiscipline.length > 0)
            {
                postdata["search_dispid"] = selecteddiscipline;
            }
            if(selectedinstitute.length > 0)
            {
                postdata["search_ins"] = selectedinstitute;
                tag = tag + '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+selectedinstitute+'</div>';
            }           
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data: postdata ,
                success: function(data) {
                    var tot = data.length;
                    if(data.length == undefined || data.result == 'null')
                    {
                        $('.pagination').children().remove();
                        //setTimeout(function(){
                            $('.overallcourse').children().remove();
                            $('.resultlist').children().remove();
                            $('.loader').remove();
                            $('.overallcourse').append('<div class="nodata">Sorry, this search criteria didn&#8217;t have any results</div>');
                        //},1000);
                    } else {
                        /************ code for pagination **************/
                        var pg = data[0].pages;
                        $('.pagination').children().remove();
                        if(pg > 5)
                            $( ".pagination" ).prepend('<div value="prev" class="pg_prev">Prev</div>');
                        for(i = 1;i<=pg;i++)
                        {
                            $('.pagination').append('<li value="'+i+'" class="page">'+i+'</li>'); 
                        }
                        pageSize = 5;
                        var j = 1;
                        showPage = function(page) {
                            console.log(page);
                            $(".page").hide();
                            $(".page").each(function(n) {
                                if (n >= pageSize * (page - 1) && n < pageSize * page)
                                    $(this).show();
                            });        
                        }
                        showPage(j);
                        if(pg > 5)
                            $('.pagination').append('<div value="next" class="pg_next">Next</div>');
                        $(".pagination li:first").addClass("active");
                        $(".pg_prev").click(function() {
                            $(".pg_next").removeClass("active");
                            $(this).addClass("active");
                            if (j != 1) {
                                showPage(--j);
                            }
                        });
                        $(".pg_next").click(function() {
                            $(".pg_prev").removeClass("active");
                            $(this).addClass("active");
                            if (j < ($('.page').length)/5) {
                                showPage(++j);
                            }    
                        });
                        /************************** end of pagination content *************/
                        if(selecteddiscipline.length > 0)
                        {
                            tag = '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+data[0].disciplineName+'</div>'+tag;
                        }
                        $('.resultlist').children().remove();
                        $('.resultlist').append(tag);
                        for(var i=0;i < tot;i++)
                        {
                            csname = data[i].subjectName;
                            csco = data[i].coordinatorName;
                            csins = data[i].Institute;
                            csdisp = data[i].disciplineName;
                            csdid = data[i].DisciplineId;
                            cstype = data[i].ContentType;
                            csid = data[i].subjectId;
                            csyid = '';
                            cscontent = data[i].contents;
                            cssyllabus = data[i].syllabusavailability;
                            csprodate = data[i].productionDate;
                            csdown = data[i].download;
                            csask = data[i].faq;
                            cscap = data[i].ccap;
                            csbook = data[i].cbook;
                            if(data[i].youtubeid != undefined && data[i].youtubeid.length > 0)
                            {
                                csyid = data[i].youtubeid;
                            }
                            $.post("individualcourse.php",
                            {
                                name: csname,
                                disp: csdisp,
                                coord: csco,
                                ins:csins,
                                count: i,
                                disid: csdid,
                                type: cstype,
                                id: csid,
                                yid:csyid,
                                content:cscontent,
                                syllabus: cssyllabus,
                                prodate: csprodate,
                                download: csdown,
                                ask: csask,
                                ccap: cscap,
                                cbook: csbook
                            },
                            function(indfile,status){
                                $("#overallcs").hide();
                                $("#defaultlist").remove();
                                //setTimeout(function(){
                                    $("#overallcs").append(indfile);
                                    $("#overallcs").show();
                                    $('.loader').remove();
                                //},1000);
                            });
                        }
                    }
                }
            });
        }
    });
    /******************* end of List by Content type *********************/

    /******************* code for check and uncheck List by Institute *********************/
    $('#institute .ccheck').change(function(evt){
        $('.overallcourse').children().remove();
        $('.loader').remove();
        $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
        var tag = '';
        var ins = $(this).val();
        if (this.checked) {
            $('#cssearch').val('');
            entersearch = '';
            keysearch = '';
            //$('.ccheck').attr('checked', false);
            var instname = $(this).next().text();
            selectedinstitute= ins;
            var postdata = 'search_ins=' + selectedinstitute;
            tag = '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+instname+'</div>';
            if(selecteddiscipline.length > 0)
            {
                postdata = postdata + '&search_dispid=' + selecteddiscipline;
            }
            if(selectedcoursetype.length > 0)
            {
                postdata = postdata + '&search_ctype=' + selectedcoursetype;
                tag = tag + '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+selectedcoursetype+'Courses</div>';
            }
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data:postdata,
                success: function(data) {
                    var tot = data.length;
                    if(data.length == undefined || data.result == 'null')
                    {
                        $('.pagination').children().remove();
                        //setTimeout(function(){
                            $('.overallcourse').children().remove();
                            $('.resultlist').children().remove();
                            $('.loader').remove();
                            $('.overallcourse').append('<div class="nodata">Sorry, this search criteria didn&#8217;t have any results</div>');
                            
                        //},1000);
                    } else {
                        /************ code for pagination **************/
                        var pg = data[0].pages;
                        $('.pagination').children().remove();
                        if(pg > 5)
                            $( ".pagination" ).prepend('<div value="prev" class="pg_prev">Prev</div>');
                        for(i = 1;i<=pg;i++)
                        {
                            $('.pagination').append('<li value="'+i+'" class="page">'+i+'</li>'); 
                        }
                        pageSize = 5;
                        var j = 1;
                        showPage = function(page) {
                            console.log(page);
                            $(".page").hide();
                            $(".page").each(function(n) {
                                
                                if (n >= pageSize * (page - 1) && n < pageSize * page)
                                    $(this).show();
                            });        
                        }
                        showPage(j);
                        if(pg > 5)
                            $('.pagination').append('<div value="next" class="pg_next">Next</div>');
                        $(".pagination li:first").addClass("active");
                        $(".pg_prev").click(function() {
                            $(".pg_next").removeClass("active");
                            $(this).addClass("active");
                            if (j != 1) {
                                showPage(--j);
                            }
                        });
                        $(".pg_next").click(function() {
                            $(".pg_prev").removeClass("active");
                            $(this).addClass("active");
                            if (j < ($('.page').length)/5) {

                                showPage(++j);
                            }    
                        });
                        /************************** end of pagination content *************/
                        if(selecteddiscipline.length > 0)
                        {
                            tag = '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+data[0].disciplineName+'</div>'+tag;
                        }
                        $('.resultlist').children().remove();
                        $('.resultlist').append(tag);
                        for(var i=0;i < tot;i++)
                        {
                            csname = data[i].subjectName;
                            csco = data[i].coordinatorName;
                            csins = data[i].Institute;
                            csdisp = data[i].disciplineName;
                            csdid = data[i].DisciplineId;
                            cstype = data[i].ContentType;
                            csid = data[i].subjectId;
                            csyid = '';
                            cscontent = data[i].contents;
                            cssyllabus = data[i].syllabusavailability;
                            csprodate = data[i].productionDate;
                            csdown = data[i].download;
                            csask = data[i].faq;
                            cscap = data[i].ccap;
                            csbook = data[i].cbook;
                            if(data[i].youtubeid != undefined && data[i].youtubeid.length > 0)
                            {
                                csyid = data[i].youtubeid;
                            }
                            $.post("individualcourse.php",
                            {
                                name: csname,
                                disp: csdisp,
                                coord: csco,
                                ins:csins,
                                count: i,
                                disid: csdid,
                                type: cstype,
                                id: csid,
                                yid:csyid,
                                content:cscontent,
                                syllabus: cssyllabus,
                                prodate: csprodate,
                                download: csdown,
                                ask: csask,
                                ccap: cscap,
                                cbook: csbook
                            },
                            function(indfile,status){
                                $("#overallcs").hide();
                                $("#defaultlist").remove();
                                //setTimeout(function(){
                                    $("#overallcs").append(indfile);
                                    $("#overallcs").show();
                                    $('.loader').remove();
                                //},1000);
                            });
                        }
                    }
                }
            });
        } else {
            selectedinstitute = '';
            $('.overallcourse').children().remove();
            $('.loader').remove();
            $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
            var postdata = new Object();
            if(selecteddiscipline.length > 0)
            {
                postdata["search_dispid"] = selecteddiscipline;
            }
            if(selectedcoursetype.length > 0)
            {
                postdata["search_ctype"] = selectedcoursetype;
                tag = tag + '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+selectedcoursetype+'Courses</div>';
            }           
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data: postdata ,
                success: function(data) {
                    var tot = data.length;
                    if(data.length == undefined || data.result == 'null')
                    {
                        $('.pagination').children().remove();
                        //setTimeout(function(){
                            $('.overallcourse').children().remove();
                            $('.resultlist').children().remove();
                            $('.loader').remove();
                            $('.overallcourse').append('<div class="nodata">Sorry, this search criteria didn&#8217;t have any results</div>');
                        //},1000);
                    } else {
                        /************ code for pagination **************/
                        var pg = data[0].pages;
                        $('.pagination').children().remove();
                        if(pg > 5)
                            $( ".pagination" ).prepend('<div value="prev" class="pg_prev">Prev</div>');
                        for(i = 1;i<=pg;i++)
                        {
                            $('.pagination').append('<li value="'+i+'" class="page">'+i+'</li>'); 
                        }
                        pageSize = 5;
                        var j = 1;
                        showPage = function(page) {
                            $(".page").hide();
                            $(".page").each(function(n) {
                                if (n >= pageSize * (page - 1) && n < pageSize * page)
                                    $(this).show();
                            });        
                        }
                        showPage(j);
                        if(pg > 5)
                            $('.pagination').append('<div value="next" class="pg_next">Next</div>');
                        $(".pagination li:first").addClass("active");
                        $(".pg_prev").click(function() {
                            $(".pg_next").removeClass("active");
                            $(this).addClass("active");
                            if (j != 1) {
                                showPage(--j);
                            }
                        });
                        $(".pg_next").click(function() {
                            $(".pg_prev").removeClass("active");
                            $(this).addClass("active");
                            if (j < ($('.page').length)/5) {
                                showPage(++j);
                            }    
                        });
                        /************************** end of pagination content *************/
                        $('.overallcourse').children().remove();
                        if(selecteddiscipline.length > 0)
                        {
                            tag = '<div class="tag btn btn-xs btn-success"><span class="glyphicon glyphicon-pushpin"></span>'+data[0].disciplineName+'</div>'+tag;
                        }
                        $('.resultlist').children().remove();
                        $('.resultlist').append(tag);
                        for(var i=0;i < tot;i++)
                        {
                            csname = data[i].subjectName;
                            csco = data[i].coordinatorName;
                            csins = data[i].Institute;
                            csdisp = data[i].disciplineName;
                            csdid = data[i].DisciplineId;
                            cstype = data[i].ContentType;
                            csid = data[i].subjectId;
                            csyid = '';
                            cscontent = data[i].contents;
                            cssyllabus = data[i].syllabusavailability;
                            csprodate = data[i].productionDate;
                            csdown = data[i].download;
                            csask = data[i].faq;
                            cscap = data[i].ccap;
                            csbook = data[i].cbook;
                            if(data[i].youtubeid != undefined && data[i].youtubeid.length > 0)
                            {
                                csyid = data[i].youtubeid;
                            }
                            $.post("individualcourse.php",
                            {
                                name: csname,
                                disp: csdisp,
                                coord: csco,
                                ins:csins,
                                count: i,
                                disid: csdid,
                                type: cstype,
                                id: csid,
                                yid:csyid,
                                content:cscontent,
                                syllabus: cssyllabus,
                                prodate: csprodate,
                                download: csdown,
                                ask: csask,
                                ccap: cscap,
                                cbook: csbook
                            },
                            function(indfile,status){
                                $("#overallcs").hide();
                                $("#defaultlist").remove();
                                //setTimeout(function(){
                                    $("#overallcs").append(indfile);
                                    $("#overallcs").show();
                                    $('.loader').remove();
                                //},1000);
                            });
                        }
                    }
                }
            });
        }
    });
    /******************* end of List by Institute *********************/

    /************** code for click search within video **************/
    $('.keyletter').click(function(evt){
        $('.overallcourse').children().remove();
        $('.loader').remove();
        $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
        $('.ccheck').prop('checked', false);
        var keyword = $(this).text();
        $(this).css("font-weight","bold");
        $.ajax({
            type: "POST",
            dataType: "json",
            url :"server.php",
            data: {videokey: keyword},
            success: function(data) {
                console.log(data);
                $('.pagination').children().remove();
                $('.resultlist').children().remove();
                $('#defaultlist').remove();
                var tot = data.length;
                if(data.length == undefined || data.result == 'null')
                {
                    $('.pagination').children().remove();
                    $('.resultlist').children().remove();
                    $('.loader').remove();
                    setTimeout(function(){
                        $('.overallcourse').append('<div class="nodata">Sorry, this search criteria didn&#8217;t have any results</div>');
                    },1000);
                } else {
                    setTimeout(function(){
                        $('.loader').remove();
                        $('.resultlist').append("<span class='text-success'> Search results for Keyword '"+keyword+"'</span><hr>");
                        for(var i = 0;i < tot;i++)
                        {
                            var url = data[i].word.replace(" ", "+");
                            $('.overallcourse').append('<div class="col-md-4"><div class="videokeyword"><a href="/keyword_search_result.php?word='+url+'" target="_blank">'+data[i].word+'</a></div></div>');
                        }
                    },500);
                }
            }
        });
    });
    /********** end of search within video **********/
    /********** code for suggest course click *******/
    $('#sug_form').submit(function(evt){
        evt.preventDefault();
        $('.sug_model').children().hide();
        $('.sug_model').append('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
        $('#sg_submit').hide();
        var sgdata = new Object();
        sgdata['sug_course'] =  $("#sug_course").val();
        sgdata['sug_level'] =  $("#slevel").val();
        sgdata['sug_email'] =  $("#sug_email").val();
        var role = $("input:radio[name=sug_type]:checked").val();
        if(role != undefined)
        {
            sgdata['sug_role'] = role;
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            url :"server.php",
            data: sgdata,
            success: function(data) {
                if(data.result == 'success')
                {
                    setTimeout(function(){
                        $('.sug_model').children('.loader').remove();
                        $('.sug_model').append('<div class="text-success"><center><h3>Thank you for your valuable suggesion ! </h3></center></div>');
                    },1000);
                } else {
                    $('.sug_model').children().show();
                }
            }
        });   
    });
    $('.sg_close').click(function(evt){
        $('.sug_model').children('.text-success').remove();
        $('.scourse').val('');
        $('.radio-inline').attr('checked',false);
        $('.sug_model').children().show();
        $('#sg_submit').show();
    });
    /********** end of suggest course click *******/
    /********** code for intrested in course click ****/
    $(document).delegate('.intrst_submit','click',function(evnt){
        var intrst_id =  $(this).parent().prev().find("#intrst_id").val();
        var intrst_email =  $(this).parent().prev().find("#intrst_email").val();
        var intrest  = $(this).attr('interest');
        var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
        if((intrst_email =='') ||(intrst_email.match(r) == null))
        {
            $('.inc').children('.text-failure').remove();
            $('.inc').append("<div class='text-failure'>Please enter an valid email</div>");
        } else {
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data: {interested_course:intrst_id,interest_email: intrst_email,interest_on: intrest },
                success: function(data) {
                    $('.intrst_model').children().hide();
                    $('.intrst_model').append('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
                    $('.intrst_submit').hide();
                    if(data.result == 'success')
                    {
                        var text = '';
                        if(intrest == "A") { 
                            text = 'course content is available.';
                        } else if(intrest == "C"){ 
                            text = ' course is available for certification';
                        }
                        setTimeout(function(){
                            $('.intrst_model').children('.loader').remove();
                            $('.intrst_model').append('<div class="text-success"><center><h4>Thank you for showing your interest! We will inform you once the '+text+'</h4></center></div>');
                        },1000);
                    } else {
                        $('.intrst_model').children().show();
                    }
                }
            }); 
        } 
    });
    $(document).delegate('.intrst_close','click',function(evnt){
        $('.intrst_model').children('.text-success').remove();
        $('.inc').children('.text-failure').remove();
        $('.intrst_model').children().show();
        $('.scourse').val('');
        $('.intrst_submit').show();
    });
/********** end of intrested in course click ****/
/********** code for report issue click ****/
    $(document).delegate('.report_submit','click',function(evnt){
        var report_course_id =  $(this).parent().parent().find("#report_id").val();
        var report_course_desc =  $(this).parent().parent().find("#report_desc").val();
        var reporter_email =  $(this).parent().parent().find("#report_email").val();
        var inst_email  = $(this).attr('email');
        console.log(report_course_desc.length);
        if(report_course_desc.length <= 0)
        {
            $('.inc').children('.text-failure').remove();
            $('.inc').append("<div class='text-failure'>Please mention the issue description.</div>");
        } else {
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data: {rep_course:report_course_id,rep_desc:report_course_desc,rep_email: reporter_email,intitute_email: inst_email },
                success: function(data) {
                    $('.report_model').children().hide();
                    $('.report_model').append('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
                    
                    if(data.result == 'success')
                    {
                        setTimeout(function(){
                            $('.report_model').children('.loader').remove();
                            $('.report_model').append('<div class="text-success"><center><h4>Your report was Submitted successfully.We will Process on it as soon as possible.</h4></center></div>');
                            $('.report_submit').hide();
                        },1000);
                    } else {
                        $('.report_model').children().show();
                    }
                }
            });
        }
    });
    $(document).delegate('.report_close','click',function(evnt){
        $('.report_model').children('.text-success').remove();
        $('#report_email').children('.text-failure').remove();
        $('.report_model').children().show();
        $('.scourse').val('');
        $('.report_submit').show();
    });
    $(document).delegate(".icon", "mouseover", function(event) {
        $('[data-toggle="tooltip"]').tooltip();
    });
    /********** end report issue click ****/
    $('#ksearchbtn').click(function(evt){
        keysearch = $('#ksearch').val();
        if(keysearch !='' && keysearch.length > 2)
        {
            $('#discipline .ccheck').prop('checked', false);
            $('#contenttype .ccheck').prop('checked', false);
            $('#institute .ccheck').prop('checked', false);
            $( "#menu-container" ).hide();
            $('.loader').remove();
            $('.overallcourse').children().remove();
            $('.resultinfo').after('<div class="loader"><center><img src="./newstyles/images/loader.gif"></center></div>');
            entersearch = "";
            /********************** search for keyword *************/
            $.ajax({
                type: "POST",
                dataType: "json",
                url :"server.php",
                data:{keysearch: keysearch},
                success: function(data) {
                    console.log(data);
                    if(data.length == undefined || data.result == 'null')
                    {
                        $('.pagination').children().remove();
                        setTimeout(function(){
                            $('#ksearch').val(keysearch);
                            $('.overallcourse').children().remove()
                            $('.resultlist').children().remove();
                            $('.loader').remove();
                            $('.overallcourse').append('<div class="nodata">Sorry, this search criteria didn&#8217;t have any results</div>');
                        },1000); 
                    } else {
                        $('.resultlist').children().remove();
                        $( ".resultlist" ).append("<span class='text-success'> Search results for keyword '"+keysearch+"'</span><hr>");
                        /************ code for pagination **************/
                        var pg = data[0].pages;
                        $('.pagination').children().remove();
                        if(pg > 5)
                            $( ".pagination" ).prepend('<div value="prev" class="pg_prev">Prev</div>');
                        for(i = 1;i<=pg;i++)
                        {
                            $('.pagination').append('<li value="'+i+'" class="page">'+i+'</li>'); 
                        }
                        pageSize = 5;
                        var j = 1;
                        showPage = function(page) {
                            console.log(page);
                            $(".page").hide();
                            $(".page").each(function(n) {                           
                                if (n >= pageSize * (page - 1) && n < pageSize * page)
                                    $(this).show();
                            });        
                        }
                        showPage(j);
                        if(pg > 5)
                            $('.pagination').append('<div value="next" class="pg_next">Next</div>');
                        $(".pagination li:first").addClass("active");
                        $(".pg_prev").click(function() {
                            $(".pg_next").removeClass("active");
                            $(this).addClass("active");
                            if (j != 1) {
                                showPage(--j);
                            }
                        });
                        $(".pg_next").click(function() {
                            $(".pg_prev").removeClass("active");
                            $(this).addClass("active");
                            if (j < ($('.page').length)/5) {
                                showPage(++j);
                            }    
                        });
                        /************************** end of pagination content *************/
                        var tot2 = data.length;
                        for(var i=0;i < tot2;i++)
                        {
                            console.log(data[i]);
                            csname = data[i].subjectName;
                            csco = data[i].coordinatorName;
                            csins = data[i].Institute;
                            csdisp = data[i].disciplineName;
                            csdid = data[i].DisciplineId;
                            cstype = data[i].ContentType;
                            csid = data[i].subjectId;
                            csyid = '';
                            cscontent = data[i].contents;
                            cssyllabus = data[i].syllabusavailability;
                            csprodate = data[i].productionDate;
                            csdown = data[i].download;
                            csask = data[i].faq;
                            cscap = data[i].ccap;
                            csbook = data[i].cbook;
                            cslecname = data[i].lectureName;
                            cslecid = data[i].lectureId;
                            if(data[i].youtubeid != undefined && data[i].youtubeid.length > 0)
                            {
                                csyid = data[i].youtubeid;
                            }
                            $.post("individualcourse.php",
                            {
                                name: csname,
                                disp: csdisp,
                                coord: csco,
                                ins:csins,
                                count: i,
                                disid: csdid,
                                type: cstype,
                                id: csid,
                                yid: csyid,
                                content:cscontent,
                                syllabus: cssyllabus,
                                prodate: csprodate,
                                download: csdown,
                                ask: csask,
                                ccap: cscap,
                                cbook: csbook,
                                lecname: cslecname,
                                lecid: cslecid
                            },
                            function(indfile,status){
                                $("#overallcs").hide();
                                $("#defaultlist").remove();
                                $("#overallcs").append(indfile);
                                $("#overallcs").show();
                                $('.loader').remove();
                            });
                        }
                    }
                }
            });
        } else {
            $('#ksearch').after("<div class='text-failure'>Please enter atleast 3 characters.</div>");
            setTimeout(function(){
                 console.log($('#ksearch').next().remove());
            },2000);
        } 
    });
    /************* end of keyword search **************/
});