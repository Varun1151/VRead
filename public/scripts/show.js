window.addEventListener("load", function() {

    $("#editbtn").click(() => {
        $("#deleteconfirm").css("display", "none")
        $("#editconfirm").css("display", "block")
    })

    $("#deletebtn").click(() => {
        $("#editconfirm").css("display", "none")
        $("#deleteconfirm").css("display", "block")
    })

    $("#requestbtn").click(() => {
        $("#feedbackconfirm").css("display", "none")
        $("#requestconfirm").css("display", "block")
    });

    $("#feedbackbtn").click(() => {
        $("#requestconfirm").css("display", "none")
        $("#feedbackconfirm").css("display", "block")
    });

    $("#deleteyes").click(() => {
        $("#deleteconfirm").css("display", "none")
        $("#deleteform").submit()
    })

    $("#requestyes").click(() => {
        $("#requestconfirm").css("display", "none")
        $("#requestform").submit()
    })

    $("#deleteno").click(() => {
        $("#deleteconfirm").css("display", "none")
    })

    $("#requestno").click(() => {
        $("#requestconfirm").css("display", "none")
    })

    $("#feedbackno").click(() => {
        $("#feedbackconfirm").css("display", "none")
    })

    $("#editno").click(() => {
        $("#editconfirm").css("display", "none")
    })

    $("#acknowledgebtn").click(() => {
        $("#rejectconfirm").css("display", "none")
        $("#acknowledgeconfirm").css("display", "block")
    });

    $("#rejectbtn").click(() => {
        $("#acknowledgeconfirm").css("display", "none")
        $("#rejectconfirm").css("display", "block")
    });

    $("#acknowledgeyes").click(() => {
        $("#acknowledgeconfirm").css("display", "none")
        $("#acknowledgeform").submit()
    })

    $("#acknowledgeno").click(() => {
        $("#acknowledgeconfirm").css("display", "none")
    })

    $("#rejectyes").click(() => {
        $("#rejectconfirm").css("display", "none")
        $("#rejectform").submit()
    })

    $("#rejectno").click(() => {
        $("#rejectconfirm").css("display", "none")
    })
})