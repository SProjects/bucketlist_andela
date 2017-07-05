$(document).ready(function () {
    $(".confirm-bucketlist-delete").click(function (event) {
        event.preventDefault();
        $("#confirm-delete-modal").modal("show");
    });
});

$(document).ready(function () {
   $(".confirm-item-delete").click(function (event) {
      event.preventDefault();
      $("#confirm-delete-item-modal").modal("show");
   });
});
