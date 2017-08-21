

//Arrays
var clients = [];

var errorMessages = [];
var fieldErrors = [];

//Global variables
var activeForm;
var errors = false;

$(document).ready(initialize);

//Initialize dom elements
function initialize() {
    $("#articleOptions").hide();
    $("#clientRegister").hide();
    $("#articleRegister").hide();

    showForm("#clientClick", "#clientRegister");
    showForm("#articleClick", "#articleOptions");
    showForm("#btnRegisterArticles", "#articleRegister");

    setSubmitEvents();

}

//Submit events from forms
function setSubmitEvents() {
    $("#frmAddClient").submit(function (e) {
        e.preventDefault();
        addClient();
        if (!errors) {
            $('#frmAddClient')[0].reset();
            showOkMessages("#clientFormMessages","Cliente agregado correctamente.");
            
            //Prueba
            console.log(clients);
            
        } else {
            showErrorMessages("#clientFormMessages");
        }
    });
}

//Receives the click event and the form to show
function showForm(clickEvent, formToShow) {
    $(clickEvent).click(function () {
        if (activeForm != formToShow) {
            $(activeForm).hide("fast");
            $(formToShow).slideDown("slow", function () {
                // Animation complete.
                activeForm = this;
            });
        }
    });
}

/********************* Helpers *********************/

//Validates only text value
function validateText(textValue) {
    var nameReg = /^[A-Za-z]+$/;
    var validText = false;

    if (nameReg.test(textValue)) {
        validText = true;
    }
    return validText;
}

//Validates correct email value
function validateEmail(emailValue) {
    var emailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var validEmail = false;

    if (emailReg.test(emailValue)) {
        validEmail = true;
    }
    return validEmail;
}

//Adds error class to an input field and adds it to the fieldErrors array
function addErrorToField(fieldId, errorMessage) {
    $(fieldId).addClass("fieldError");
    fieldErrors.push(fieldId);
    errorMessages.push(errorMessage);
}

//Clear errors from form field
function clearErrors() {

    for (var i = 0; i < fieldErrors.length; i++) {
        var actualField = fieldErrors[i];
        $(actualField).removeClass("fieldError");
    }
    fieldErrors = [];
    errorMessages = [];
    errors = false;
    $("#clientFormMessages").empty();
}

//Show error messages in the assigned Div
function showErrorMessages(fieldDiv) {

    for (var i = 0; i < errorMessages.length; i++) {
        var actualMsg = errorMessages[i];
        $(fieldDiv).append("<label>" + actualMsg + "</label>" + "<br>");
    }
    $(fieldDiv).removeClass("divOk");
    $(fieldDiv).addClass("divError");
    $(fieldDiv).slideDown();
}

//Show ok message in the assigned Div
function showOkMessages(fieldDiv,message) {
    $(fieldDiv).append("<label>" + message + "</label>");
    $(fieldDiv).removeClass("divError");
    $(fieldDiv).addClass("divOk");
    $(fieldDiv).slideDown("slow",function(){
        $(this).delay(5000).slideUp("slow");
    });
    $(fieldDiv).empty();
}

/********************* Clients *********************/

//Validates and adds client using frmAddClient form data
function addClient() {

    //Clear fields with errors
    clearErrors();

    var name = $("#txtName").val().trim();
    var surname = $("#txtSurname").val().trim();
    var age = $("#txtAge").val();
    var gender = $("input[name=radioGender]:checked", "#frmAddClient").val();
    var cellphone = $("#txtCellphone").val();
    var address = $("#txtAddress").val().trim();
    var email = $("#txtEmail").val();
    var neighborhood = $("#txtNeighborhood").val();

    validateClientName(name);
    validateClientSurName(surname);
    validateClientCellPhone(cellphone);
    validateClientEmail(email);

    if(!errors){
        var clientToAdd = {
            "name": name,
            "surname": surname,
            "age": age,
            "gender": gender,
            "cellphone": cellphone,
            "address": address,
            "email": email,
            "neighborhood": neighborhood
        };

        clients.push(clientToAdd);
    }
}

function validateClientName(name) {
    if (!validateText(name)) {
        addErrorToField("#txtName", "El nombre debe ser solo texto.");
        errors = true;
    }
}

function validateClientSurName(surname) {
    if (!validateText(surname)) {
        addErrorToField("#txtSurname", "El apellido debe ser solo texto.");
        errors = true;
    }
}

function validateClientCellPhone(cellphone){
    if(isNaN(cellphone) || cellphone.length < 9){
        addErrorToField("#txtCellphone", "Formato de celular incorrecto.");
        errors = true;
    }
}

function validateClientEmail(email) {
    if (!validateEmail(email)) {
        addErrorToField("#txtEmail", "Formato de email incorrecto.");
        errors = true;
    } else {
        var emailFound = false;
        for (var i = 0; i < clients.length && !emailFound; i++) {
            var actualClient = clients[i];
            if (actualClient.email.toLowerCase() == email.toLowerCase()) {
                addErrorToField("#txtEmail", "Email de cliente ya existente.");
                emailFound = true;
                errors = true;
            }
        }
    }
}

