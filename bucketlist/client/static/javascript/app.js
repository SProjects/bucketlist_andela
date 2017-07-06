$(document).on("click", ".confirm-bucketlist-delete", function (event) {
  event.preventDefault();
  $("#confirm-delete-modal").modal("show");
});

$(document).on("click", ".confirm-item-delete", function (event) {
  event.preventDefault();
  $("#confirm-delete-item-modal").modal("show");
});

$(document).on('click', ".message .close", function() {
    $(this).closest('.message').transition('fade');
});
