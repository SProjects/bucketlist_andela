$(document).on("click", ".confirm-bucketlist-delete", function (event) {
  event.preventDefault();
  $("#confirm-delete-modal").modal("show");
});

$(document).on("click", ".confirm-item-delete", function (event) {
  event.preventDefault();
  $("#confirm-delete-item-modal").modal("show");
});

$(document).on("click", ".confirm-item-complete", function (event) {
  event.preventDefault();
  $("#confirm-complete-item-modal").modal("show");
});

$(document).on("click", ".confirm-item-incomplete", function (event) {
  event.preventDefault();
  $("#confirm-incomplete-item-modal").modal("show");
});

$(document).on('click', ".message .close", function() {
    $(this).closest('.message').transition('fade');
});
