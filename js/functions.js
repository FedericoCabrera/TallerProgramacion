function initialize(){
    openNav();
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}

function show(){
    document.getElementById("ClientRegister").style.display = 'block';
}

function hide(){
    document.getElementById("ClientRegister").style.display = 'none';
}