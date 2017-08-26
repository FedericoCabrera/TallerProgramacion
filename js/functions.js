

//Arrays
var clients = [];
var items = [];

//Association between item category and icon image
var itemImage = [
    {
        "category": "Juguetes",
        "icon": "fa-gamepad"
    },
    {
        "category": "Escolares",
        "icon": "fa-book"
    },
    {
        "category": "Oficina",
        "icon": "fa-briefcase"
    },
    {
        "category": "Alimentos",
        "icon": "fa-cutlery"
    },
    {
        "category": "Limpieza",
        "icon": "fa-shower",
    },
    {
        "category": "Otros",
        "icon": "fa-gift"
    }
];

//Errors
var errorMessages = [];
var fieldErrors = [];

//Global variables
var activeForm;
var errors = false;

$(document).ready(initialize);

//Initialize dom elements
function initialize() {
    $("#itemOptions").hide();
    $("#clientRegister").hide();
    $("#itemRegister").hide();
    $("#itemConsult").hide();
    $("#itemQR").hide();

    showForm("#clientClick", "#clientRegister");
    showForm("#itemClick", "#itemOptions");
    showForm("#btnRegisterItems", "#itemRegister");
    showForm("#btnConsultItems", "#itemConsult", createItemsTable);


    setSubmitEvents();

}

//Submit events from forms
function setSubmitEvents() {
    $("#frmAddClient").submit(function (e) {
        e.preventDefault();
        addClient();
        if (!errors) {
            $('#frmAddClient')[0].reset();
            showOkMessages("#clientFormMessages", "Cliente agregado correctamente.");
            //Prueba
            console.log(clients);
        } else {
            showErrorMessages("#clientFormMessages");
        }
    });

    $("#frmAddItem").submit(function (e) {
        e.preventDefault();
        addItem();
        if (!errors) {
            $('#frmAddItem')[0].reset();
            showOkMessages("#itemFormMessages", "Artículo agregado correctamente.");
            //Prueba
            console.log(items);
        } else {
            showErrorMessages("#itemFormMessages");
        }
    });
}

/********************* Helpers *********************/

//Receives the click event, the form to show and optionably a function to execute with the event
function showForm(clickEvent, formToShow, executableFunction) {
    $(clickEvent).click(function () {
        if (activeForm != formToShow) {
            $(activeForm).hide("fast");          
            $(formToShow).slideDown("slow", function () {
                // Animation complete.
                activeForm = this;
            });
            if (executableFunction !== undefined) {
                executableFunction();
            }
        }
    });
}

//Validates only text value
function validateText(textValue) {
    var nameReg = /^[a-zA-Z\s]*$/;
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
    errors = true;
}

//Clear errors from form field
function clearErrors(messagesFormId) {

    for (var i = 0; i < fieldErrors.length; i++) {
        var actualField = fieldErrors[i];
        $(actualField).removeClass("fieldError");
    }
    fieldErrors = [];
    errorMessages = [];
    errors = false;
    $(messagesFormId).empty();
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
function showOkMessages(fieldDiv, message) {
    $(fieldDiv).empty();
    $(fieldDiv).append("<label>" + message + "</label>");
    $(fieldDiv).removeClass("divError");
    $(fieldDiv).addClass("divOk");
    $(fieldDiv).slideDown("slow", function () {
        $(this).delay(3000).slideUp("slow");
    });

}

/********************* Clients *********************/

//Validates and adds client using frmAddClient form data
function addClient() {

    //Clear fields with errors
    clearErrors("#clientFormMessages");

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

    if (!errors) {
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
        addErrorToField("#txtName", "El nombre no puede contener números.");
    }
}

function validateClientSurName(surname) {
    if (!validateText(surname)) {
        addErrorToField("#txtSurname", "El apellido no puede contener números.");
    }
}

function validateClientCellPhone(cellphone) {
    if (isNaN(cellphone) || cellphone.length < 9) {
        addErrorToField("#txtCellphone", "Formato de celular incorrecto.");
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
            }
        }
    }
}


/********************* Items *********************/

//Validates and adds item using frmAddItem form data and adds item, generating QR code as well
function addItem() {

    //Clear fields with errors
    clearErrors("#itemFormMessages");

    var name = $("#txtItemName").val().trim();
    var id = $("#txtItemId").val();
    var description = $("#txtItemDescription").val();
    var price = $("#txtItemPrice").val();
    var category = $("#optCategory").find(":selected").text();

    //Associates image to item
    var categoryImg;
    for (var i = 0; i < itemImage.length; i++) {
        var actualCategoryImg = itemImage[i];
        if (category == actualCategoryImg.category) {
            categoryImg = actualCategoryImg.icon;
        }
    }

    validateItemName(name);
    validateItemId(id);
    validateItemPrice(price);
    //validateItemCategory(category);

    if (!errors) {
        var itemToAdd = {
            "name": name,
            "id": id,
            "description": description,
            "price": price,
            "category": category,
            "categoryImage": categoryImg
        };

        items.push(itemToAdd);

        //QR Code generation
        $("#itemQR").show("explode");
        $("#lblQR").val = name;
        $("#itemQRContainer").empty.qrcode(itemToAdd);
    }
}

function validateItemName(name) {
    if (!validateText(name)) {
        addErrorToField("#txtItemName", "El nombre no puede contener números.");
    }
}

function validateItemId(id) {
    var existentItem = false;
    for (var i = 0; i < items.length && !existentItem; i++) {
        var actualItem = items[i];
        if (actualItem.id == id) {
            addErrorToField("#txtItemId", "Id de articulo ya existente.");
            existentItem = true;
        }
    }
}

function validateItemPrice(price) {
    if (isNaN(price) || price < 0) {
        addErrorToField("##txtItemPrice", "El precio del artículo debe ser un número positivo.");
    }
}

//Sorts and creates a table with the items saved in the items array
function createItemsTable() {

    $("#itemsTable").empty();
    if (items.length > 0) {

        //Sorts items array
        items.sort(function (a, b) { return a.id - b.id });

        $("#itemsTable").append("<tr><th>Nombre</th><th>Código</th><th>Categoría</th></tr>");
        $(items).each(function (index, element) {
            $("#itemsTable").append("<tr><td> " + element.name + " </td> <td> " + element.id + " </td> <td> <i class=' fa " + element.categoryImage + "'> &nbsp; </i>" + element.category + "</td></tr>");
            console.log("<tr><td> " + element.name + " </td> <td> " + element.id + " </td> <td> <i class=' fa " + element.categoryImage + "'></i>" + element.category + "</td></tr>");
        });
    } else {
        $("#itemsTable").append("<tr><td> No hay artículos ingresados. </td></tr> ");
    }

}
/*function validateItemCategory(category) {
    var existentItemCateg = false;

    for (var i = 0; i < itemImage.length && !existentItemCateg; i++) {
        var actualItemCateg = itemImage[i];
        if (category == actualItemCateg.category) {
            existentItemCateg = true;
        }
    }
    if (!existentItemCateg) {
        addErrorToField("#optCategory", "Debe seleccionar una categoría válida.");
    }
}*/

