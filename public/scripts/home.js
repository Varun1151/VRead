window.addEventListener("load", function() {

    $("#filterbtn").click(() => {
        $("#filterform").submit()
    })



    const urlparams = new URLSearchParams(window.location.search)
    const myParam = urlparams.get("Dept")
    var dept = document.getElementById("Dept"),
        options = dept.options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].text == myParam) {
            options[i].selected = true
        }
    }

})