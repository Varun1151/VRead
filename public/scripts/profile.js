window.addEventListener("load", function() {

    $("#editinfobtn").click(() => {
        $("#deleteconfirm").css("display", "none")
        $("#editpicconfirm").css("display", "none")
        $("#editinfoconfirm").css("display", "block")
    })

    $("#editinfono").click(() => {
        $("#editinfoconfirm").css("display", "none")
    })

    $("#editpicbtn").click(() => {
        $("#deleteconfirm").css("display", "none")
        $("#editinfoconfirm").css("display", "none")
        $("#editpicconfirm").css("display", "block")
    })

    $("#editpicno").click(() => {
        $("#editpicconfirm").css("display", "none")
    })

    $("#deletebtn").click(() => {
        $("#editinfoconfirm").css("display", "none")
        $("#editpicconfirm").css("display", "none")
        $("#deleteconfirm").css("display", "block")
    })


    $("#deleteyes").click(() => {
        $("#deleteconfirm").css("display", "none")
        $("#deleteform").submit()
    })

    $("#deleteno").click(() => {
        $("#deleteconfirm").css("display", "none")
    })

})