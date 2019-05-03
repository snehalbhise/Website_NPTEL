<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- saved from url=(0043)http://nptel.ac.in/LocalChapter/contact.php -->
<html xmlns="http://www.w3.org/1999/xhtml" class=" js flexbox flexboxlegacy canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Examinations</title>
	<!----bootstrap css-->
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="./NPTEL LocalChapter_files/bootstrap.3.3.4.css">
  <link rel="stylesheet" href="./NPTEL LocalChapter_files/bootstrap.vertical-tabs.css">
  <link href="./NPTEL LocalChapter_files/font-awesome.min.css" rel="stylesheet">
  <!----naveen stylesheet-->
  <link href="./NPTEL LocalChapter_files/stylenew.css" rel="stylesheet">
  <link href="./NPTEL LocalChapter_files/css" rel="stylesheet" type="text/css">
  <link href="./NPTEL LocalChapter_files/css(1)" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="./NPTEL LocalChapter_files/jquery-ui.css">
  <link rel="stylesheet" href="./NPTEL LocalChapter_files/style.css">
  <link rel="icon" href="http://nptel.ac.in/LocalChapter/Assets/images/nptellogo.jpg" type="image/jpg" sizes="16x16">
<style type="text/css">
.navbar-default, .navbar-default .dropdown-menu {
    background-color: #7D1935;
    border-color: #710f2a;
}
.navbar-default .navbar-nav>li>a:hover, .navbar-default .navbar-nav>li>a:focus {
    color: #ffffff;
    background-color: #4c0217;
    font-weight: bold;
}
.navbar-default .navbar-nav>.open>a, .navbar-default .navbar-nav>.open>a:hover, .navbar-default .navbar-nav>.open>a:focus {
    background-color: #4c0217;
    color: #ffffff;
}
.navbar-default .dropdown-menu>li>a:hover, .navbar-default .dropdown-menu>.active>a, .navbar-default .dropdown-menu>.active>a:hover {
    background-color: #4c0217;
}
.carousel-inner{
  width:100%;
  max-height: 500px !important;
}
.carousel img {
    min-width: 100%;
}
.homecslist .fa, .glyphicon {
    color: #4c0217;
    font-weight: bold;
}
#myTab .active a {
    background-color: #4A96AD;
    color: #FFF;
    font-weight: bold;
}
.followup {
    height: 40px;
    line-height: 40px;
    background-color: #4a96ad;
    padding-left: 20px;
    color: #FFF;
    margin-bottom: 1px;
    /*margin-bottom: 25px;*/
    cursor:pointer;
}
.lcwell {
    background-color: #4a96ad;
    text-align: center;
    font-size: 18px!important;
    color: #FFF;
}
.jumbotron p {
    font-size: 17px;
  }
  .specialtext {
    color:#000;
    font-size: 18px;
  }
.pull-right,.pull-left {
  color:#FFF!important;
  height:40px;
  line-height: 40px;
  width: 20px;
}
.flowactive {
    background-color: rgba(125, 25, 53, 0.89);
}
.maincollapse {
    border: 1px solid #4a96ad;
    border-radius: 2%;
}
.panel-default>.newshead {
    background: #4a96ad !important;
}
.localtitle {
    color: #4a96ad;
}
.panel-default > .cslist-head {
    background-color: #4a96ad;
}
.stepswell.active {
    background-color: #4a96ad;
    color: #FFF;
    font-weight: bold;
}
.fa {
    color: #7d1935;
    font-weight: bold;
}
.darkborder
{
  border-top:4px solid #4a96ad;
}
</style>
</head>
<body>
   
        <!---nav bar section -->
	<nav class="navbar navbar-default navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
    		  <a class="navbar-brand">VPKBIET'S NPTEL Local Chapter</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="index.php">Home</a></li>
            <li><a href="Courses.html">Courses</a></li>
                              <li><a href="Examination.html">Examination</a></li>
                          
      		 <li><a href="Contact.html">Contact Us</a></li>
            <li><a href="About.html">About Us</a></li>
          </ul>
        </div>
      </div>
  </nav>     <div class="container" style="margin-top:90px;" align="center">
            <div class="container" align="center">
		
		<div class="well" style="text-align:center"><b>NPTEL Results</b></div>
                <h4 class="panel-title">DATABASE MANAGEMENT SYSTEM 2016 RESULT</h4><br><br>
                  

     
                                    
		




                                    <div align="center">
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "wet";


$conn = mysqli_connect($servername, $username, $password, $dbname);
$sql="SELECT * from dbml2016result order by percentage desc";
$result=mysqli_query($conn,$sql);
    
 echo "<table border=2 width=70% align=center style=text-align:center;>";
    
    echo "<tr>";
         echo "<th height=30 style=text-align:center; size=30>". "Roll No"."</th>";
         echo "<th height=30 style=text-align:center; size=30>"."Student Name"."</th>";
         echo "<th height=30 style=text-align:center; size=30>"."Address" ."</th>";
                  echo "<th height=30 style=text-align:center; size=30>"."Percentage"."</th>";
         echo "</tr>";
   while ($res=mysqli_fetch_array($result)){

    echo "<tr>";
    echo "<td height=30 style=text-align:center; size=30>".$res['rollno']."</td>";
        echo "<td height=30 size=30>".$res['name']."</td>";
         echo "<td height=30 size=30>".$res['address']."</td>";
            echo "<td height=30 size=30>".$res['percentage']."</td>";
                   
    echo "</tr>";
   }  
        echo "</table>";
        echo "<br></br>";
 echo"<td>"."<a href=Examination.html>"."<input type=submit value=Back name=back>"."</a>"."</td>";
     echo "<table border=2px  align=center>";
   

mysqli_close($conn);


?>
                                    </div>
                        
                                </div>
                   