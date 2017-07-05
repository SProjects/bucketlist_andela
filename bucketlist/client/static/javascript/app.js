$(document).ready(function () {
    $(".confirm-bucketlist-delete").click(function (event) {
        event.preventDefault();
        $("#confirm-delete-modal").modal('show')
    });
});
