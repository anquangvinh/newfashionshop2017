/* 
 * 
 * MỌI NGƯỜI VIẾT JAVASCRIPT VÀO ĐÂY.
 * 
 * NHỚ LÀ: VIẾT CÁI GÌ, THÌ CHÚ THÍCH CÁI ĐÓ, CÔNG DỤNG ĐỂ LÀM GÌ
 * 
 */

$(document).ready(function () {
    /*    
     * Cấu hình cho datatable
     */
    $('#dataTables-example').DataTable({
        responsive: true
    });

    /*==============================VINH - PRODUCT============================*/
    //Bảng datatable của product-list
    $('#productList_dataTable').DataTable({
        responsive: true,
        columnDefs: [
            {"orderable": false, "targets": [1, 2, 3, 4, 5, 6]}, //disable thuộc tính order của các cột 1,2,3,4,5,6
            {"width": "8%", "targets": 0},
            {"width": "9%", "targets": 1},
            {"width": "21%", "targets": 2},
            {"width": "20%", "targets": 3},
            {"width": "17%", "targets": 4},
            {"width": "5%", "targets": 5},
            {"width": "20%", "targets": 6}
        ],
        //Tạo DOM cho các component trong datatable
        dom: '<"row text-center"<"col-lg-4"l><"#fs_product_filter.col-lg-4"><"col-lg-4"f>><"row"<"col-lg-12">t><"row"<"col-xs-4"i><"col-xs-8"p>>',
        //Chức năng lọc theo Category và SubCategory
        initComplete: function () {
            this.api().columns(2).every(function () {
                var column = this;
                var select = $('<select class="form-control"><option value="">-- Filter by Category - SubCategory --</option></select>')
                        .appendTo($("#fs_product_filter").empty())
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                    );

                            column
                                    .search(val ? '^' + val + '$' : '', true, false)
                                    .draw();
                        });

                column.data().unique().sort().each(function (d, j) {
                    select.append('<option value="' + d + '">' + d + '</option>')
                });
            });
        }
    });

    /* CKEDITOR -CKFINDER IN PRODUCT CREATE */
    if ($("#fs-product-description").length) {
        var fs_product_description = CKEDITOR.replace('fs-product-description', {
            toolbar: [
                {name: 'document', items: ['Source']},
                {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
                {name: 'editing', items: ['Find', 'Replace']},
                {name: 'insert', items: ['Image', 'Table', 'HorizontalRule']},
                '/',
                {name: 'styles', items: ['Format', 'Font', 'FontSize']},
                {name: 'colors', items: ['TextColor', 'BGColor']},
                '/',
                {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
                {name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote']}
            ]
        });
        CKFinder.setupCKEditor(fs_product_description, {basePath: '/fashionshop/assets/ckfinder/'});
    }

    //Multiple step ------- PRODUCT CREATE FORM
    //jQuery time
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    $("#fs-fieldset-general-info").on("click", ".next", function () {
        var cateID = $("#fs-product-category").val();
        var subCateID = $("#fs-product-subCategory").val();
        var productName = $("#fs-product-name").val();
        var price = $("#fs-product-price").val();
        var mainImg = $("#fs-product-main-img").val();
        var discount = $("#fs-product-discount").val();
        var count = 0;


        if (cateID == 0) {
            $("p#fs-select-cate-error").text("Please choose a Category!");
            $("#fs-product-category").focus();
            count++;
        } else {
            $("p#fs-select-cate-error").text("");
        }

        if (subCateID == 0) {
            $("p#fs-select-subcate-error").text("Please choose a SubCategory!");
            $("#fs-product-subCategory").focus();
            count++;
        } else {
            $("p#fs-select-subcate-error").text("");
        }

        if (productName == "") {
            $("#fs-product-name-error").text("Product Name cannot be empty!");
            $("#fs-product-name").focus();
            count++;
        } else if (productName.length < 5 || productName.length > 25) {
            $("#fs-product-name-error").text("Product Name must have 5 - 25 characters!");
            $("#fs-product-name").focus();
        } else {
            $("#fs-product-name-error").text("");
        }

        if (price == "") {
            $("#fs-product-price-error").text("Price cannot be empty!");
            $("#fs-product-price").focus();
            count++;
        } else if (isNaN(price)) {
            $("#fs-product-price-error").text("Price must be a number!");
            $("#fs-product-price").focus();
            count++;
        } else if (price < 0) {
            $("#fs-product-price-error").text("Price must be >0!.");
            $("#fs-product-price").focus();
            count++;
        } else {
            $("#fs-product-price-error").text("");
        }

        if (discount == "") {
            $("#fs-product-discount-error").text("Discount cannot be empty!");
            $("#fs-product-discount").focus();
            count++;
        } else if (isNaN(discount)) {
            $("#fs-product-discount-error").text("Discount must be a number!");
            $("#fs-product-discount").focus();
            count++;
        } else if (!(discount % 1 === 0)) {
            $("#fs-product-discount-error").text("Discount must be Integer!");
            $("#fs-product-discount").focus();
            count++;
        } else if (discount < 0 || discount > 100) {
            $("#fs-product-discount-error").text("Discount must be from 0-100!.");
            $("#fs-product-discount").focus();
            count++;
        } else {
            $("#fs-product-discount-error").text("");
        }

        if (mainImg == "") {
            $("#fs-error-mess-product-main-img").text("Image cannot be empty!");
            $("#fs-product-main-img").focus();
            count++;
        } else {
            $("#fs-error-mess-product-main-img").text("");
        }

        if (count == 0) {
            $.ajax({
                url: "admin/ajax/checkProductName.html",
                method: "POST",
                data: {productName: productName},
                success: function (response) {
                    if (response == 1) {
                        $("#fs-product-name-error").text("Duplicate Product Name!");
                        $("#fs-product-name").focus();
                    } else {
                        if (animating) {
                            return false;
                        }
                        animating = true;
                        current_fs = $(".next").parent().parent().parent().parent().parent();
                        next_fs = $(".next").parent().parent().parent().parent().parent().next();

                        //activate next step on progressbar using the index of next_fs
                        $("#fs-product-add-progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

                        //show the next fieldset
                        next_fs.show();
                        //hide the current fieldset with style
                        current_fs.animate({opacity: 0}, {
                            step: function (now, mx) {
                                //as the opacity of current_fs reduces to 0 - stored in "now"
                                //1. scale current_fs down to 80%
                                scale = 1 - (1 - now) * 0.2;
                                //2. bring next_fs from the right(50%)
                                left = (now * 50) + "%";
                                //3. increase opacity of next_fs to 1 as it moves in
                                opacity = 1 - now;
                                next_fs.css({'left': left, 'opacity': opacity});
                            },
                            duration: 400,
                            complete: function () {
                                current_fs.hide();
                                animating = false;
                            },
                            //this comes from the custom easing plugin
                            easing: 'easeInOutBack'
                        });
                    }
                }
            });

        }
    });

    $(".previous").click(function () {
        if (animating) {
            return false;
        }
        animating = true;

        current_fs = $(this).parent().parent().parent();
        previous_fs = $(this).parent().parent().parent().prev();

        //de-activate current step on progressbar
        $("#fs-product-add-progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function (now, mx) {
                //1. scale previous_fs from 80% to 100%
                scale = 0.8 + (1 - now) * 0.2;
                //2. take current_fs to the right(50%) - from 0%
                left = ((1 - now) * 50) + "%";
                //3. increase opacity of previous_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({'left': left});
                previous_fs.css({'opacity': opacity});
            },
            duration: 400,
            complete: function () {
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });

    /* Bắt lỗi validation */
    $("#fs-fieldset-general-info").on("change", "#fs-product-subCategory", function () {
        var subCateID = $("#fs-product-subCategory").val();
        if (subCateID == 0) {
            $("p#fs-select-subcate-error").text("Please choose a SubCategory!");
        } else {
            $("p#fs-select-subcate-error").text("");
        }
    });

    $("#fs-product-name").keyup(function () {
        var productName = $("#fs-product-name").val();
        $.ajax({
            url: "admin/ajax/checkProductName.html",
            method: "POST",
            data: {productName: productName},
            success: function (response) {
                if (response == 1) {
                    $("#fs-product-name-error").text("Duplicate Product Name!");
                } else {
                    if (productName == "") {
                        $("#fs-product-name-error").text("Product Name cannot be empty!");
                    } else if (productName.length < 5 || productName.length > 25) {
                        $("#fs-product-name-error").text("Product Name must have 5 - 25 characters!");
                    } else {
                        $("#fs-product-name-error").text("");
                    }
                }
            }
        });
    });

    $("#fs-product-price").keyup(function () {
        var price = $("#fs-product-price").val();
        if (price == "") {
            $("#fs-product-price-error").text("Price cannot be empty!");
        } else if (isNaN(price)) {
            $("#fs-product-price-error").text("Price must be a number!");
        } else if (price < 0) {
            $("#fs-product-price-error").text("Price must be >0!.");
        } else {
            $("#fs-product-price-error").text("");
        }
    });

    $("#fs-product-discount").keyup(function () {
        var discount = $("#fs-product-discount").val();
        if (discount == "") {
            $("#fs-product-discount-error").text("Discount cannot be empty!");
        } else if (isNaN(discount)) {
            $("#fs-product-discount-error").text("Discount must be a number!");
        } else if (!(discount % 1 === 0)) {
            $("#fs-product-discount-error").text("Discount must be an Integer number!");
        } else if (discount < 0 || discount > 100) {
            $("#fs-product-discount-error").text("Discount must be a number from 0-100!.");
        } else {
            $("#fs-product-discount-error").text("");
        }
    });

    /* Ajax when select a Category */
    $("#fs-product-subCategory").attr("disabled", "disabled").
            html("<option value=\"0\">-- Please select Category First --</option>");

    $("#fs-fieldset-general-info").on("change", "#fs-product-category", function () {
        var cateID = $("#fs-product-category").val();
        if (cateID == 0) {
            $("#fs-product-subCategory").attr("disabled", "disabled").
                    html("<option value=\"0\">-- Please select Category First --</option>");
            $("p#fs-select-cate-error").text("Please choose a Category!");
        } else {
            $("p#fs-select-cate-error").text("");
            $("#fs-product-subCategory").removeAttr("disabled");
            $("#fs-product-subCategory").html("<option value=\"0\">-- Please select sub-category --</option>");
            $.ajax({
                url: "admin/ajax/getSubCategory.html",
                method: "POST",
                data: {cateID: cateID},
                dataType: 'JSON',
                success: function (response) {
                    $.each(response, function (i, item) {
                        var subCateOption = "<option value=\"" + item.subCateID + "\">" + item.subCateName + "</option>";
                        $("#fs-product-subCategory").append(subCateOption);
                    });
                }
            });
        }

    });

    /* HIỂN THỊ IMG KHI UP ẢNH - PRODUCT CREATE */
    $('input[name="productSubImg"]').fileuploader({
        limit: 4,
        extensions: ['jpg', 'jpeg', 'png'],
        dialogs: {
            // alert dialog
            alert: function (text) {
                $("#fs-error-mess-productSubImg").text(text);
            }
        },
        thumbnails: {
            // Callback fired after the item image was loaded
            onImageLoaded: function (itemEl, listEl, parentEl, newInputEl, inputEl) {
                $("#fs-error-mess-productSubImg").empty();
            }
        }
    });

    $('input[class="colorImg"]').fileuploader({
        limit: 1,
        extensions: ['jpg', 'jpeg', 'png'],
        dialogs: {
            // alert dialog
            alert: function (text) {
                $("#fs-error-mess-color-img").text(text);
            }
        },
        thumbnails: {
            // Callback fired after the item image was loaded
            onImageLoaded: function (itemEl, listEl, parentEl, newInputEl, inputEl) {
                $("#fs-error-mess-color-img").empty();
            }
        }
    });

    $('input[id="fs-product-main-img"]').fileuploader({
        limit: 1,
        extensions: ['jpg', 'jpeg', 'png'],
        dialogs: {
            // alert dialog
            alert: function (text) {
                $("#fs-error-mess-product-main-img").text(text);
            }
        },
        thumbnails: {
            // Callback fired after the item image was loaded
            onImageLoaded: function (itemEl, listEl, parentEl, newInputEl, inputEl) {
                $("#fs-error-mess-product-main-img").empty();
            }
        }
    });

    $('input[id="fs-edit-product-color-img"]').fileuploader({
        limit: 1,
        extensions: ['jpg', 'jpeg', 'png'],
        thumbnails: {
            // Callback fired after the item image was loaded
            onImageLoaded: function (itemEl, listEl, parentEl, newInputEl, inputEl) {
                $("#fs-error-mess-productSubImg").empty();
            }
        }

    });

    $('input[id="fs-update-product-color-img"]').fileuploader({
        limit: 1,
        extensions: ['jpg', 'jpeg', 'png'],
        dialogs: {
            // alert dialog
            alert: function (text) {
                $("#fs-update-product-color-img-err-mess").text(text);
            }
        },
        thumbnails: {
            // Callback fired after the item image was loaded
            onImageLoaded: function (itemEl, listEl, parentEl, newInputEl, inputEl) {
                $("#fs-update-product-color-img-err-mess").empty();
            }
        }
    });

    $('input[name="fs-update-product-sub-img"]').fileuploader({
        limit: 1,
        extensions: ['jpg', 'jpeg', 'png'],
        enableApi: true
    });

//    var fs_count_div_color = 0;
    /* XỬ LÝ BUTTON ADD-MORE-SIZE - PRODUCT CREATE */
    $("#fs-fieldset-detail").on("click", ".fs-add-more-size", function () {
        var colorNo = $(this).parent().parent().parent().parent().attr("fs-big-div-color");
        var addMoreSize;
        if (colorNo == 0) {
            addMoreSize = " <div class=\"col-xs-12 fs-div-size\" style=\"padding-left: 0; border: 1px #CCC dashed; margin-bottom: 5px;\">\n\
                                <div class=\"form-group col-xs-5\">\n\
                                    <label>Size <span class=\"fs-color-red\">*</span></label>\n\
                                    <input name=\"size\" class=\"form-control fs-product-size\" placeholder=\"Size\" style=\"text-transform:uppercase\">\n\
                                </div>\n\
                                <div class=\"form-group col-xs-5\">\n\
                                    <label>Quantity <span class=\"fs-color-red\">*</span></label>\n\
                                    <input name=\"quantity\" class=\"form-control fs-product-quantity\" placeholder=\"Quantity\">\n\
                                </div>\n\
                                <div class=\"form-group col-xs-2\">\n\
                                    <button style=\"margin-top: 25px\" type=\"button\" data-toggle=\"modal\" class=\"btn btn-danger fs-btn-delete-size\" title=\"Delete Size\">\n\
                                        <i class=\"fa fa-close\" aria-hidden=\"true\"></i>\n\
                                    </button>\n\
                                </div>\n\
                                <p class=\"fs-error-mess-size\" style=\"color: red; margin-left: 15px\"></p>\n\
                                <p class=\"fs-error-mess-quantity\" style=\"color: red; margin-left: 15px\"></p>\n\
                            </div>";
        } else {
            addMoreSize = " <div class=\"col-xs-12 fs-div-size\" style=\"padding-left: 0; border: 1px #CCC dashed; margin-bottom: 5px;\">\n\
                                <div class=\"form-group col-xs-5\">\n\
                                    <label>Size <span class=\"fs-color-red\">*</span></label>\n\
                                    <input name=\"size_" + colorNo + "\" class=\"form-control fs-product-size\" placeholder=\"Size\" style=\"text-transform:uppercase\">\n\
                                </div>\n\
                                <div class=\"form-group col-xs-5\">\n\
                                    <label>Quantity <span class=\"fs-color-red\">*</span></label>\n\
                                    <input name=\"quantity_" + colorNo + "\" class=\"form-control fs-product-quantity\" placeholder=\"Quantity\">\n\
                                </div>\n\
                                <div class=\"form-group col-xs-2\">\n\
                                    <button style=\"margin-top: 25px\" type=\"button\" data-toggle=\"modal\" class=\"btn btn-danger fs-btn-delete-size\" title=\"Delete Size\">\n\
                                        <i class=\"fa fa-close\" aria-hidden=\"true\"></i>\n\
                                    </button>\n\
                                </div>\n\
                                <p class=\"fs-error-mess-size\" style=\"color: red; margin-left: 15px\"></p>\n\
                                <p class=\"fs-error-mess-quantity\" style=\"color: red; margin-left: 15px\"></p>\n\
                            </div>";
        }

        $(this).parent().siblings(".fs-more-size").append(addMoreSize);
    });

    /* XỬ LÝ BUTTON ADD-MORE-COLOR - PRODUCT CREATE */
    $("#fs-fieldset-detail").on("click", "#fs-add-more-color", function () {
        var fs_count_div_color = $(this).parent().siblings("#fs-more-color").find(".fs-div-color").length + 1;
        $("#fs-delete-color").removeClass("disabled");
        var addMoreColor = "<div class=\"col-xs-12 fs-div-color\" style=\"padding: 5px 0; border: 1px #CCC dashed; margin-bottom: 10px\" fs-big-div-color=\"" + fs_count_div_color + "\">\n\
                                <div class=\"col-md-6 fs-right-border\">\n\
                                    <div class=\"form-group\">\n\
                                        <label>Color 0" + parseInt(fs_count_div_color + 1) + " <span class=\"fs-color-red\">*</span></label>\n\
                                        <p class=\"help-block\"></p>\n\
                                        <input name=\"color\" class=\"form-control fs-product-color-name\" placeholder=\"Color\">\n\
                                    </div>\n\
                                    <div class=\"form-group\">\n\
                                        <label>Color Image <span class=\"fs-color-red\">*</span></label>\n\
                                        <p id=\"fs-error-mess-color-img-" + fs_count_div_color + "\" style=\"color: red;\"></p>\n\
                                        <input fs-color-img-index=\"" + fs_count_div_color + "\" type=\"file\" name=\"colorImg[]\" class=\"colorImg\">\n\
                                    </div>\n\
                                    <br>\n\
                                    <div class=\"col-xs-12\" style=\"padding: 0;\">\n\
                                        <div class=\"col-xs-12\" style=\"padding-left: 0; border: 1px #CCC dashed; margin-bottom: 5px;\" >\n\
                                            <div class=\"form-group col-xs-5\">\n\
                                                <label>Size <span class=\"fs-color-red\">*</span></label>\n\
                                                <input name=\"size_" + fs_count_div_color + "\"  style=\"text-transform:uppercase\" class=\"form-control fs-product-size\" placeholder=\"Size\">\n\
                                            </div>\n\
                                            <div class=\"form-group col-xs-5\">\n\
                                                <label>Quantity <span class=\"fs-color-red\">*</span></label>\n\
                                                <input name=\"quantity_" + fs_count_div_color + "\" class=\"form-control fs-product-quantity\" placeholder=\"Quantity\">\n\
                                            </div>\n\
                                            <div class=\"form-group col-xs-2\">\n\
                                            </div>\n\
                                            <p class=\"fs-error-mess-size\" style=\"color: red; margin-left: 15px\"></p>\n\
                                            <p class=\"fs-error-mess-quantity\" style=\"color: red; margin-left: 15px\"></p>\n\
                                        </div>\n\
                                        <span class=\"fs-more-size\"></span>\n\
                                        <div class=\"form-group col-xs-4\" style=\"margin-top: 20px\">\n\
                                            <button type=\"button\" class=\"btn btn-warning fs-add-more-size\" title=\"Add More Size\">\n\
                                                <i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Size\n\
                                            </button>\n\
                                        </div>\n\
                                    </div>\n\
                                    <div class=\"clearfix\"></div>\n\
                                </div>\n\
                                <div class=\"col-md-6\">\n\
                                    <div class=\"form-group\">\n\
                                        <label>Product Sub Image <span class=\"fs-color-red\">*</span></label>\n\
                                        <p id=\"fs-error-mess-productSubImg-" + fs_count_div_color + "\" class=\"help-block fs-error-mes-productSubImg\"></p>\n\
                                        <input name=\"productSubImg_" + fs_count_div_color + "\" class=\"fs-productSubImg\" type=\"file\" multiple=\"multiple\">\n\
                                    </div>\n\
                                </div>\n\
                            </div>";
        $(this).parent().siblings("#fs-more-color").hide().append(addMoreColor).fadeIn(1000);

        $("input[name=\"productSubImg_" + fs_count_div_color + "\"]").fileuploader({
            limit: 4,
            extensions: ['jpg', 'jpeg', 'png'],
            dialogs: {
                // alert dialog
                alert: function (text) {
                    $("#fs-error-mess-productSubImg-" + fs_count_div_color).text(text);
                }
            },
            thumbnails: {
                // Callback fired after the item image was loaded
                onImageLoaded: function (itemEl, listEl, parentEl, newInputEl, inputEl) {
                    $("#fs-error-mess-productSubImg-" + fs_count_div_color).empty();
                }
            }
        });

        $("input[fs-color-img-index=\"" + fs_count_div_color + "\"]").fileuploader({
            limit: 1,
            extensions: ['jpg', 'jpeg', 'png'],
            dialogs: {
                // alert dialog
                alert: function (text) {
                    $("#fs-error-mess-color-img-" + fs_count_div_color).text(text);
                }
            },
            thumbnails: {
                // Callback fired after the item image was loaded
                onImageLoaded: function (itemEl, listEl, parentEl, newInputEl, inputEl) {
                    $("#fs-error-mess-color-img-" + fs_count_div_color).empty();
                }
            }
        });
    });

    /* XỬ LÝ BUTTON DELETE SIZE */
    $("#fs-fieldset-detail").on("click", ".fs-btn-delete-size", function () {
        var elem = $(this).parent().parent();
        $("#fs-confirm-delete-size").modal("show");

        $("#fs-confirm-delete-size").on("click", ".btn-ok", function () {
            elem.remove();
            $("#fs-confirm-delete-size").modal("hide");
        });
    });

    /* XỬ LÝ BUTTON DELETE COLOR */
    $("#fs-fieldset-detail").on("click", "#fs-delete-color", function () {
        var fs_count_div_color = $(this).parent().siblings("#fs-more-color").find(".fs-div-color").length + 1;
        if (!$(this).hasClass("disabled")) {
            $("#fs-modal-change-color-number").text("\"COLOR " + fs_count_div_color + " \"");
            $("#fs-confirm-delete-color").modal("show");
        }
    });

    $("#fs-confirm-delete-color").on("click", ".btn-delete-color-ok", function () {
        $("span#fs-more-color .fs-div-color").last().remove();
        $("#fs-confirm-delete-color").modal("hide");

        if ($("span#fs-more-color").children().length < 1) {
            $("#fs-delete-color").addClass("disabled");
        }
    });

    /* XỬ LÝ ON CHANGE PRODUCT-STATUS product-list.jsp */
    $(".fs-div-product-list-select-box").on("change", ".fs-product-status-select-box", function () {
        var newProductStatus = $(this).val();
        var productID = $(this).attr("fs-product");
        $(this).parent().siblings(".fs-trigger").addClass("drawn");

        if (newProductStatus == 1) {
            $(this).siblings(".fs-stopworking-icon").addClass("fs-display-none");
        } else {
            $(this).siblings(".fs-stopworking-icon").removeClass("fs-display-none");
        }

        $.ajax({
            url: "admin/ajax/changeProductStatus.html",
            method: "POST",
            data: {newProductStatus: newProductStatus, productID: productID},
            success: function (response) {

            }
        });

        setTimeout(function () {
            $(".fs-trigger").removeClass("drawn");
        }, 2000);
    });

    /* XỬ LÝ BUTTON SUBMIT CREATE NEW PRODUCT */
    $("#fs-btn-create-new-product").click(function (e) {
        e.preventDefault();
        var count = 0;

        $(".fs-product-color-name").each(function () {
            if ($(this).val() == "") {
                $(this).focus();
                $(this).siblings("p").text("Color is required!");
                count++;
            } else if ($(this).val().length < 3) {
                $(this).focus();
                $(this).siblings("p").text("Color has more than 3 characters!");
                count++;
            } else {
                $(this).siblings("p").text("");
            }
        });

        $(".colorImg").each(function () {
            if ($(this).val() == "") {
                $(this).focus();
                $(this).parent().siblings("p").text("Choose an image for Color!");
                count++;
            }
        });

        $(".fs-product-size").each(function () {
            if ($(this).val() == "") {
                $(this).focus();
                $(this).parent().siblings("p.fs-error-mess-size").text("Size is required!");
                count++;
            } else {
                $(this).parent().siblings("p.fs-error-mess-size").text("");
            }
        });

        $(".fs-product-quantity").each(function () {
            if ($(this).val() == "") {
                $(this).focus();
                $(this).parent().siblings("p.fs-error-mess-quantity").text("Quantity is required!");
                count++;
            } else if (isNaN($(this).val())) {
                $(this).focus();
                $(this).parent().siblings("p.fs-error-mess-quantity").text("Quantity must be a number!");
                count++;
            } else if ($(this).val() < 0) {
                $(this).focus();
                $(this).parent().siblings("p.fs-error-mess-quantity").text("Quantity must be >= 0!");
                count++;
            } else {
                $(this).parent().siblings("p.fs-error-mess-quantity").text("");
            }
        });

        $(".fs-productSubImg").each(function () {
            if ($(this).val() == "") {
                $(this).parent().siblings("p.fs-error-mes-productSubImg").text("Choose at least 1 Sub Image for Product");
                $(this).focus();
                count++;
            }
        });

        if (count == 0) {
            $("#fs-form-product-create-new").submit();
        }
    });

    $("#fs-fieldset-detail").on("keyup", ".fs-product-color-name", function () {
        if ($(this).val() == "") {
            $(this).focus();
            $(this).siblings("p").text("Color is required!");
        } else if ($(this).val().length < 3) {
            $(this).focus();
            $(this).siblings("p").text("Color has more than 3 characters!");
        } else {
            $(this).siblings("p").text("");
        }
    });

    $("#fs-fieldset-detail").on("keyup", ".fs-product-size", function () {
        if ($(this).val() == "") {
            $(this).focus();
            $(this).parent().siblings("p.fs-error-mess-size").text("Size is required!");
        } else {
            $(this).parent().siblings("p.fs-error-mess-size").text("");
        }
    });

    $("#fs-fieldset-detail").on("keyup", ".fs-product-quantity", function () {
        if ($(this).val() == "") {
            $(this).focus();
            $(this).parent().siblings("p.fs-error-mess-quantity").text("Quantity is required!");
        } else if (isNaN($(this).val())) {
            $(this).focus();
            $(this).parent().siblings("p.fs-error-mess-quantity").text("Quantity must be a number!");
        } else if ($(this).val() < 0) {
            $(this).focus();
            $(this).parent().siblings("p.fs-error-mess-quantity").text("Quantity must be >= 0!");
        } else {
            $(this).parent().siblings("p.fs-error-mess-quantity").text("");
        }
    });

    /* TRANG PRODUCT-UPDATE */
    /* Xử lý choose "FIRST" TASK */
    $("#fs-product-update-page").on("change", "#fs-select-product-update-choose-first-task", function () {
        $(".fs-select-product-update-task").addClass("fs-display-none");
        $(".fs-select-product-update-task").hide();
        $("#fs-select-product-update-choose-color").val(0);
        var select = $(this).val();
        if (select == 1) {
            $("#fs-edit-product-general-info").show("drop", 500);
            $("#fs-select-product-update-choose-color").hide();
            $(".btn-edit-product-color").parent().parent().removeClass("fs-highlighter");
            $("#fs-edit-product-color-form").hide();
            $(".btn-edit-product-color").removeClass("disabled");
        }

        if (select == 2) {
            $("#fs-edit-product-color").delay(200).show("drop", 300);
            $("#fs-select-product-update-choose-color").hide();
            $(".btn-edit-product-color").parent().parent().removeClass("fs-highlighter");
            $("#fs-edit-product-color-form").hide();
            $(".btn-edit-product-color").removeClass("disabled");
        }

        if (select == 3 || select == 4) {
            $("#fs-select-product-update-choose-color").hide();
            $("#fs-select-product-update-choose-color").show("bounce", 500);
            $(".btn-edit-product-color").parent().parent().removeClass("fs-highlighter");
            $("#fs-edit-product-color-form").hide();
            $(".btn-edit-product-color").removeClass("disabled");
        }

        if (select == 0) {
            $("#fs-select-product-update-choose-color").hide();
            $(".btn-edit-product-color").parent().parent().removeClass("fs-highlighter");
            $("#fs-edit-product-color-form").hide();
            $(".btn-edit-product-color").removeClass("disabled");
        }

    });

    /*Xử lý choose Color*/
    $("#fs-product-update-page").on("change", "#fs-select-product-update-choose-color", function () {
        var task = $("#fs-select-product-update-choose-first-task").val();
        var colorID = $("#fs-select-product-update-choose-color").val();

        if (task == 3) {
            $("#fs-edit-product-size").show("drop", 500);
            $(".fs-edit-product-table-size").hide();
            $("#fs-edit-product-table-size-" + colorID).show("drop", 500);
        } else {
            $("#fs-edit-product-size").hide();
        }

        if (task == 4) {
            $("#fs-edit-product-sub-img").show("drop", 500);
            $(".fs-edit-product-table-sub-img").hide();
            $("#fs-edit-product-table-sub-img-" + colorID).show("drop", 500);
        } else {
            $("#fs-edit-product-sub-img").hide();
        }

        if (colorID == 0) {
            $(".fs-select-product-update-task").addClass("fs-display-none");
            $(".fs-select-product-update-task").hide();
        }
    });

    $("#fs-edit-product-table-color tbody").sortable();

    $(".fs-edit-product-table-sub-img tbody").sortable();

    /* 1. Edit Product General Info */
    $("#fs-product-update-page").on("change", "#fs-product-category", function () {
        var cateID = $(this).val();
        $.ajax({
            url: "admin/ajax/getSubCategory.html",
            method: "POST",
            data: {cateID: cateID},
            dataType: 'JSON',
            success: function (response) {
                var subCateOption = "<option value=\"0\">-- Please select sub-category --</option>";
                $.each(response, function (i, item) {
                    subCateOption += "<option value=\"" + item.subCateID + "\">" + item.subCateName + "</option>";

                });
                $("#fs-product-sub-category").html(subCateOption);
                $("#fs-product-sub-category").focus();
            }
        });
    });

    if ($(".fs-alert-update-product-info").length > 0) {
        setTimeout(function () {
            $(".fs-alert-update-product-info").hide("fade", 500);
        }, 2000);
    }

    /* 2. Edit Product Color */
    /* Edit Product Color - Change Status */
    $("#fs-product-update-page").on("change", ".fs-product-update-color-status", function () {
        var colorID = $(this).attr("fs-product-colorID");
        var newStt = $(this).val();

        if (newStt == 1) {
            $(this).siblings(".fs-stopworking-icon-product-color-update").addClass("fs-display-none");
        } else {
            $(this).siblings(".fs-stopworking-icon-product-color-update").removeClass("fs-display-none");
        }

        $.ajax({
            url: "admin/ajax/updateProductColorStatus.html",
            method: "POST",
            data: {colorID: colorID, newStt: newStt},
            success: function (response) {
                if (response == "1") {
                    $.notify({
                        icon: 'glyphicon glyphicon-ok-sign',
                        title: '<strong>Success!</strong>',
                        message: 'Update Color Status Completed!.'
                    }, {
                        type: 'success',
                        placement: {
                            from: 'top',
                            align: 'right'
                        },
                        delay: 2500,
                        timer: 200,
                        mouse_over: 'pause',
                        animate: {
                            enter: 'animated fadeInRight',
                            exit: 'animated fadeOutRight'
                        },
                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                '<span data-notify="icon"></span> ' +
                                '<span data-notify="title">{1}</span> ' +
                                '<span data-notify="message">{2}</span>' +
                                '<div class="progress" data-notify="progressbar">' +
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                '</div>' +
                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                '</div>'
                    });
                } else {
                    $.notify({
                        icon: 'glyphicon glyphicon-warning-sign',
                        title: '<strong>Error!</strong>',
                        message: 'Update Color Status Failed, Please Refresh (F5) and do it again!.'
                    }, {
                        type: 'danger',
                        placement: {
                            from: 'top',
                            align: 'right'
                        },
                        delay: 3000,
                        timer: 200,
                        mouse_over: 'pause',
                        animate: {
                            enter: 'animated fadeInRight',
                            exit: 'animated fadeOutRight'
                        },
                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                '<span data-notify="icon"></span> ' +
                                '<span data-notify="title">{1}</span> ' +
                                '<span data-notify="message">{2}</span>' +
                                '<div class="progress" data-notify="progressbar">' +
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                '</div>' +
                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                '</div>'
                    });
                }
            }
        });

    });

    $("#fs-edit-product-color-form").hide();
    /* Edit Product Color - show update color form */
    $("#fs-product-update-page").on("click", ".btn-edit-product-color", function () {
        if (!$(this).hasClass("disabled")) {
            $(this).parent().parent().siblings("tr").removeClass("fs-highlighter");
            $(this).parent().parent().addClass("fs-highlighter");

            $(".btn-edit-product-color").removeClass("disabled");
            $(this).addClass("disabled");

            var colorID = $(this).attr("fs-product-colorID");
            //get thong tin su dung ajax
            $.ajax({
                url: "admin/ajax/getProductColorByID.html",
                method: "POST",
                data: {colorID: colorID},
                dataType: "JSON",
                success: function (response) {
                    //load vao form
                    $("#fs-edit-product-color-form").hide("slide", {direction: "up"}, "fast", function () {
                        $("#fs-form-edit-product-color")[0].reset();
                        $("input#fs-edit-product-color-input").val(response.color);
                        $("input#fs-edit-product-color-hidden-id").val(colorID);
                        $("button#fs-btn-update-product-color-submit").attr("fs-product-colorID", response.colorID);
                        $("#fs-edit-product-color-form").show("slide", {direction: "up"}, "slow");
                    });
                }
            });
        }

    });

    /* Edit Product Color - Button Cancel to close product Color FORM */
    $("#fs-product-update-page").on("click", "#btn-cancel-edit-product-color-form", function () {
        $("#fs-edit-product-color-form").hide("slide", {direction: "up"}, "fast");
        $(".btn-edit-product-color").removeClass("disabled");
        $(".btn-edit-product-color").parent().parent().removeClass("fs-highlighter");
    });

    /* Edit Product Color - Button SAVE - Submit product Color FORM */
    $("#fs-product-update-page").on("click", "#fs-btn-update-product-color-submit", function (e) {
        e.preventDefault();
        var colorVal = $("#fs-edit-product-color-input").val();
        var productID = parseInt($("#fs-product-id").text());
        var colorID = $("#fs-edit-product-color-hidden-id").val();
        //Kiểm tra rỗng
        if (colorVal == "") {
            $("#fs-update-product-color-name-err-mess").text("Color is required!");
            $("#fs-edit-product-color-input").focus();
        } else if (colorVal.length < 3) { //Kiểm tra nhỏ nhất 3 ký tự
            $("#fs-update-product-color-name-err-mess").text("Color has more than 3 characters!");
            $("#fs-edit-product-color-input").focus();
        } else if ($("#fs-update-product-color-img-err-mess").text() == "Only jpg, jpeg, png files are allowed to be uploaded.") {
            $("#fs-update-product-color-img").focus();
        } else {
            $.ajax({
                url: "admin/ajax/checkDuplicateColor.html",
                method: "POST",
                data: {productID: productID, color: colorVal, colorID: colorID},
                success: function (response) {
                    if (response == "1") {
                        $("#fs-update-product-color-name-err-mess").text("Duplicate Color!. Please choose another one!");
                        $("#fs-edit-product-color-input").focus();
                    } else {
                        var formData = new FormData();
                        formData.append("productID", parseInt($("#fs-product-id").text()));
                        formData.append("colorID", parseInt($("#fs-btn-update-product-color-submit").attr("fs-product-colorID")));
                        formData.append("color", $("input#fs-edit-product-color-input").val());
                        if ($("#fs-update-product-color-img")[0].files[0] != null) {
                            formData.append("colorImg", $("#fs-update-product-color-img")[0].files[0]);
                        }

                        $.ajax({
                            url: "admin/ajax/updateProductColor.html",
                            method: "POST",
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false,
                            beforeSend: function () {
                                $("#fs-ajax-loading").css("display", "block");
                            },
                            success: function (response) {
                                if (response != "fail") {
                                    setTimeout(function () {
                                        $("#fs-edit-product-color-form").hide();
                                        $("#fs-tbody-update-color-change").html(response);
                                        $("#fs-ajax-loading").css("display", "none");
                                        $.notify({
                                            icon: 'glyphicon glyphicon-ok-sign',
                                            title: '<strong>Success!</strong>',
                                            message: 'Update Color Status Completed!.'
                                        }, {
                                            type: 'success',
                                            placement: {
                                                from: 'top',
                                                align: 'right'
                                            },
                                            delay: 3000,
                                            timer: 200,
                                            mouse_over: 'pause',
                                            animate: {
                                                enter: 'animated fadeInRight',
                                                exit: 'animated fadeOutRight'
                                            },
                                            template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                                    '<span data-notify="icon"></span> ' +
                                                    '<span data-notify="title">{1}</span> ' +
                                                    '<span data-notify="message">{2}</span>' +
                                                    '<div class="progress" data-notify="progressbar">' +
                                                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                                    '</div>' +
                                                    '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                                    '</div>'
                                        });
                                    }, 400);
                                } else {
                                    $.notify({
                                        icon: 'glyphicon glyphicon-warning-sign',
                                        title: '<strong>Error!</strong>',
                                        message: 'Update Color Failed, Please Refresh (F5) and do it again!.'
                                    }, {
                                        type: 'danger',
                                        placement: {
                                            from: 'top',
                                            align: 'right'
                                        },
                                        delay: 3000,
                                        timer: 200,
                                        mouse_over: 'pause',
                                        animate: {
                                            enter: 'animated fadeInRight',
                                            exit: 'animated fadeOutRight'
                                        },
                                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                                '<span data-notify="icon"></span> ' +
                                                '<span data-notify="title">{1}</span> ' +
                                                '<span data-notify="message">{2}</span>' +
                                                '<div class="progress" data-notify="progressbar">' +
                                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                                '</div>' +
                                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                                '</div>'
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    /* Edit Product Color - EVENT keyup - Check Validation product Color Input */
    $("#fs-product-update-page").on("keyup", "#fs-edit-product-color-input", function () {
        var colorVal = $(this).val();
        var productID = parseInt($("#fs-product-id").text());
        var colorID = $("#fs-edit-product-color-hidden-id").val();
        //Kiểm tra rỗng
        if (colorVal == "") {
            $("#fs-update-product-color-name-err-mess").text("Color is required!");
        } else if (colorVal.length < 3) { //Kiểm tra nhỏ nhất 3 ký tự
            $("#fs-update-product-color-name-err-mess").text("Color has more than 3 characters!");
        } else {
            $.ajax({
                url: "admin/ajax/checkDuplicateColor.html",
                method: "POST",
                data: {productID: productID, color: colorVal, colorID: colorID},
                success: function (response) {
                    if (response == "1") { //Kiểm tra trùng
                        $("#fs-update-product-color-name-err-mess").text("Duplicate Color!. Please choose another one!");
                    } else {
                        $("#fs-update-product-color-name-err-mess").text("");
                    }
                }
            });
        }
    });

    /* Edit Product Color - Sort Order Color - Update to Database */
    $("#fs-product-update-page").on("sortupdate", "#fs-edit-product-table-color tbody", function (event, ui) {
        var afterSort = $("#fs-edit-product-table-color tbody").children("tr");
        var productID = parseInt($("#fs-product-id").text());
        var numberOfElement = afterSort.length;
        $("#fs-edit-product-color-form").hide();
        $.each(afterSort, function (i, ite) {
            var colorID = ite.attributes[1].value;
            var position = i;
            $.ajax({
                url: "admin/ajax/updateColorOrder.html",
                method: "POST",
                data: {colorID: colorID, position: position},
                success: function () {
                    if (parseInt(numberOfElement) == parseInt(i + 1)) {
                        $.ajax({
                            url: "admin/ajax/getColorList.html",
                            method: "POST",
                            data: {productID: productID},
                            beforeSend: function () {
                                $("#fs-ajax-loading").css("display", "block");
                            },
                            success: function (response) {
                                setTimeout(function () {
                                    $("#fs-tbody-update-color-change").html(response);
                                    $("#fs-ajax-loading").css("display", "none");
                                    $.notify({
                                        icon: 'glyphicon glyphicon-ok-sign',
                                        title: '<strong>Success!</strong>',
                                        message: 'Color Order was changed!.'
                                    }, {
                                        type: 'success',
                                        placement: {
                                            from: 'top',
                                            align: 'right'
                                        },
                                        delay: 3000,
                                        timer: 200,
                                        mouse_over: 'pause',
                                        animate: {
                                            enter: 'animated fadeInRight',
                                            exit: 'animated fadeOutRight'
                                        },
                                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                                '<span data-notify="icon"></span> ' +
                                                '<span data-notify="title">{1}</span> ' +
                                                '<span data-notify="message">{2}</span>' +
                                                '<div class="progress" data-notify="progressbar">' +
                                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                                '</div>' +
                                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                                '</div>'
                                    });
                                }, 400);
                            }
                        });
                    }
                }
            });
        });


    });

    /*3. Edit Product Size */
    /* For SIZE */
    $('.fs-edit-product-size-val').editable({
        mode: 'inline',
        validate: function (value) {
            if (value == "") {
                return 'Size cannot be empty!';
            }
        },
        success: function (response, newValue) {
            if (response == 2) {
                return 'Size has already existed in this Color!';
            }
        }
    });

    $('.fs-edit-product-size-val').on('save', function (e, params) {
        $.notify({
            icon: 'glyphicon glyphicon-ok-sign',
            title: '<strong>Success!</strong>',
            message: 'Product <strong>SIZE</strong> was changed!.'
        }, {
            type: 'success',
            placement: {
                from: 'top',
                align: 'right'
            },
            delay: 3000,
            timer: 200,
            mouse_over: 'pause',
            animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
            },
            template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                    '<span data-notify="icon"></span> ' +
                    '<span data-notify="title">{1}</span> ' +
                    '<span data-notify="message">{2}</span>' +
                    '<div class="progress" data-notify="progressbar">' +
                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                    '</div>' +
                    '<a href="{3}" target="{4}" data-notify="url"></a>' +
                    '</div>'
        });
    });

    /* For QUANTITY */
    $('.fs-edit-product-quantity-val').editable({
        mode: 'inline',
        validate: function (value) {
            if (value == "") {
                return 'Quantity cannot be empty!';
            }

            if (isNaN(value)) {
                return 'Quantity must be a number!';
            }

            if (value < 0) {
                return 'Quantity must be >= 0!';
            }
        }
    });

    $('.fs-edit-product-quantity-val').on('save', function (e, params) {
        $.notify({
            icon: 'glyphicon glyphicon-ok-sign',
            title: '<strong>Success!</strong>',
            message: 'Product <strong>QUANTITY</strong> was changed!.'
        }, {
            type: 'success',
            placement: {
                from: 'top',
                align: 'right'
            },
            delay: 3000,
            timer: 200,
            mouse_over: 'pause',
            animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
            },
            template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                    '<span data-notify="icon"></span> ' +
                    '<span data-notify="title">{1}</span> ' +
                    '<span data-notify="message">{2}</span>' +
                    '<div class="progress" data-notify="progressbar">' +
                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                    '</div>' +
                    '<a href="{3}" target="{4}" data-notify="url"></a>' +
                    '</div>'
        });
    });

    /* BTN DELETE SIZE */
    $("#fs-product-update-page").on("click", ".fs-update-product-button-delete-size", function () {
        $("#fs-update-product-confirm-delete-size").modal("show");
        var sizeID = $(this).attr("fs-size-id");
        var prodSize = $(this).attr("fs-size");
        $("#fs-update-product-confirm-delete-size").attr("data-1", sizeID);
        $("#fs-change-size-in-modal").text(prodSize);
    });

    $("#fs-product-update-page").on("click", ".btn-update-product-confirm-delete-size", function () {
        $("#fs-update-product-confirm-delete-size").modal("hide");
        var sizeID = $("#fs-update-product-confirm-delete-size").attr("data-1");
        var colorID = parseInt($("#fs-select-product-update-choose-color").val());
        var prodSize = $("#fs-change-size-in-modal").text();
        $.ajax({
            url: "admin/ajax/deleteProductSize.html",
            method: "POST",
            data: {sizeID: sizeID, colorID: colorID},
            beforeSend: function () {
                $("#fs-ajax-loading").css("display", "block");
            },
            success: function (response) {
                if (response == "1") {
                    $.notify({
                        icon: 'glyphicon glyphicon-warning-sign',
                        title: '<strong>Error!</strong>',
                        message: 'Delete FAILED!, That Size was no longer existed!.'
                    }, {
                        type: 'danger',
                        placement: {
                            from: 'top',
                            align: 'right'
                        },
                        delay: 3000,
                        timer: 200,
                        mouse_over: 'pause',
                        animate: {
                            enter: 'animated fadeInRight',
                            exit: 'animated fadeOutRight'
                        },
                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                '<span data-notify="icon"></span> ' +
                                '<span data-notify="title">{1}</span> ' +
                                '<span data-notify="message">{2}</span>' +
                                '<div class="progress" data-notify="progressbar">' +
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                '</div>' +
                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                '</div>'
                    });
                } else if (response == "2") {
                    $.notify({
                        icon: 'glyphicon glyphicon-warning-sign',
                        title: '<strong>Error!</strong>',
                        message: 'Delete FAILED!, Please Refresh (F5) and do it again!.'
                    }, {
                        type: 'danger',
                        placement: {
                            from: 'top',
                            align: 'right'
                        },
                        delay: 3000,
                        timer: 200,
                        mouse_over: 'pause',
                        animate: {
                            enter: 'animated fadeInRight',
                            exit: 'animated fadeOutRight'
                        },
                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                '<span data-notify="icon"></span> ' +
                                '<span data-notify="title">{1}</span> ' +
                                '<span data-notify="message">{2}</span>' +
                                '<div class="progress" data-notify="progressbar">' +
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                '</div>' +
                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                '</div>'
                    });
                } else {
                    setTimeout(function () {
                        $("#fs-edit-product-tbody-size-" + colorID).html(response);

                        /* For SIZE */
                        $('.fs-edit-product-size-val').editable({
                            mode: 'inline',
                            validate: function (value) {
                                if (value == "") {
                                    return 'Size cannot be empty!';
                                }
                            },
                            success: function (response, newValue) {
                                if (response == 2) {
                                    return 'Size has already existed in this Color!';
                                }
                            }
                        });
                        $('.fs-edit-product-size-val').on('save', function (e, params) {
                            $.notify({
                                icon: 'glyphicon glyphicon-ok-sign',
                                title: '<strong>Success!</strong>',
                                message: 'Product <strong>SIZE</strong> was changed!.'
                            }, {
                                type: 'success',
                                placement: {
                                    from: 'top',
                                    align: 'right'
                                },
                                delay: 3000,
                                timer: 200,
                                mouse_over: 'pause',
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                        '<span data-notify="icon"></span> ' +
                                        '<span data-notify="title">{1}</span> ' +
                                        '<span data-notify="message">{2}</span>' +
                                        '<div class="progress" data-notify="progressbar">' +
                                        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                        '</div>' +
                                        '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                        '</div>'
                            });
                        });

                        /* For QUANTITY */
                        $('.fs-edit-product-quantity-val').editable({
                            mode: 'inline',
                            validate: function (value) {
                                if (value == "") {
                                    return 'Quantity cannot be empty!';
                                }

                                if (isNaN(value)) {
                                    return 'Quantity must be a number!';
                                }

                                if (value < 0) {
                                    return 'Quantity must be >= 0!';
                                }
                            }
                        });
                        $('.fs-edit-product-quantity-val').on('save', function (e, params) {
                            $.notify({
                                icon: 'glyphicon glyphicon-ok-sign',
                                title: '<strong>Success!</strong>',
                                message: 'Product <strong>QUANTITY</strong> was changed!.'
                            }, {
                                type: 'success',
                                placement: {
                                    from: 'top',
                                    align: 'right'
                                },
                                delay: 3000,
                                timer: 200,
                                mouse_over: 'pause',
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                        '<span data-notify="icon"></span> ' +
                                        '<span data-notify="title">{1}</span> ' +
                                        '<span data-notify="message">{2}</span>' +
                                        '<div class="progress" data-notify="progressbar">' +
                                        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                        '</div>' +
                                        '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                        '</div>'
                            });
                        });

                        $("#fs-ajax-loading").css("display", "none");

                        $.notify({
                            icon: 'glyphicon glyphicon-ok-sign',
                            title: '<strong>Success!</strong>',
                            message: prodSize + ' Size was <b>Deleted!</b>!.'
                        }, {
                            type: 'success',
                            placement: {
                                from: 'top',
                                align: 'right'
                            },
                            delay: 3000,
                            timer: 200,
                            mouse_over: 'pause',
                            animate: {
                                enter: 'animated fadeInRight',
                                exit: 'animated fadeOutRight'
                            },
                            template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                    '<span data-notify="icon"></span> ' +
                                    '<span data-notify="title">{1}</span> ' +
                                    '<span data-notify="message">{2}</span>' +
                                    '<div class="progress" data-notify="progressbar">' +
                                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                    '</div>' +
                                    '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                    '</div>'
                        });
                    }, 400);
                }
            }
        });
    });

    /* Change SIZE Status */
    $("#fs-product-update-page").on("change", ".fs-product-update-size-status", function () {
        var sizeID = $(this).attr("fs-size-id");
        var newSTT = $(this).val();

        if (newSTT == 1) {
            $(this).siblings(".fs-stopworking-icon-product-color-update").addClass("fs-display-none");
        } else {
            $(this).siblings(".fs-stopworking-icon-product-color-update").removeClass("fs-display-none");
        }

        $.ajax({
            url: "admin/ajax/changeSizeStatus.html",
            method: "POST",
            data: {sizeID: sizeID, newSTT: newSTT},
            success: function (response) {
                if (response == "1") {
                    $.notify({
                        icon: 'glyphicon glyphicon-ok-sign',
                        title: '<strong>Success!</strong>',
                        message: 'Size Status was changed!.'
                    }, {
                        type: 'success',
                        placement: {
                            from: 'top',
                            align: 'right'
                        },
                        delay: 2500,
                        timer: 200,
                        mouse_over: 'pause',
                        animate: {
                            enter: 'animated fadeInRight',
                            exit: 'animated fadeOutRight'
                        },
                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                '<span data-notify="icon"></span> ' +
                                '<span data-notify="title">{1}</span> ' +
                                '<span data-notify="message">{2}</span>' +
                                '<div class="progress" data-notify="progressbar">' +
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                '</div>' +
                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                '</div>'
                    });
                } else {
                    $.notify({
                        icon: 'glyphicon glyphicon-warning-sign',
                        title: '<strong>Error!</strong>',
                        message: 'Change Status Failed, Please Refresh (F5) and do it again!.'
                    }, {
                        type: 'danger',
                        placement: {
                            from: 'top',
                            align: 'right'
                        },
                        delay: 3000,
                        timer: 200,
                        mouse_over: 'pause',
                        animate: {
                            enter: 'animated fadeInRight',
                            exit: 'animated fadeOutRight'
                        },
                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                '<span data-notify="icon"></span> ' +
                                '<span data-notify="title">{1}</span> ' +
                                '<span data-notify="message">{2}</span>' +
                                '<div class="progress" data-notify="progressbar">' +
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                '</div>' +
                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                '</div>'
                    });
                }
            }
        });
    });

    /* 4. Edit Product SubImg */
    /* Change Order */
    /* Edit Product SubImg - Sort Order SubImg - Update to Database */
    $("#fs-product-update-page").on("sortupdate", ".fs-edit-product-table-sub-img tbody", function (event, ui) {
        var afterSort = $(this).children("tr");
        var colorID = parseInt($("#fs-select-product-update-choose-color").val());

        var numberOfElement = afterSort.length;

        $.each(afterSort, function (i, ite) {
            var productSubImgID = ite.attributes[1].value;
            var position = i;
            $.ajax({
                url: "admin/ajax/updateSubImgOrder.html",
                method: "POST",
                data: {productSubImgID: productSubImgID, position: position},
                success: function () {
                    if (parseInt(numberOfElement) == parseInt(i + 1)) {
                        $.ajax({
                            url: "admin/ajax/getSubImgListByColor.html",
                            method: "POST",
                            data: {colorID: colorID},
                            beforeSend: function () {
                                $("#fs-ajax-loading").css("display", "block");
                            },
                            success: function (response) {
                                setTimeout(function () {
                                    $("#fs-edit-product-tbody-sub-img-" + colorID).html(response);
                                    $("#fs-edit-product-tbody-sub-img-" + colorID + " input[name=\"fs-update-product-sub-img\"]").fileuploader({
                                        limit: 1,
                                        extensions: ['jpg', 'jpeg', 'png'],
                                        enableApi: true
                                    });
                                    $("#fs-ajax-loading").css("display", "none");

                                    $.notify({
                                        icon: 'glyphicon glyphicon-ok-sign',
                                        title: '<strong>Success!</strong>',
                                        message: 'Sub-Image Order was changed!.'
                                    }, {
                                        type: 'success',
                                        placement: {
                                            from: 'top',
                                            align: 'right'
                                        },
                                        delay: 3000,
                                        timer: 200,
                                        mouse_over: 'pause',
                                        animate: {
                                            enter: 'animated fadeInRight',
                                            exit: 'animated fadeOutRight'
                                        },
                                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                                '<span data-notify="icon"></span> ' +
                                                '<span data-notify="title">{1}</span> ' +
                                                '<span data-notify="message">{2}</span>' +
                                                '<div class="progress" data-notify="progressbar">' +
                                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                                '</div>' +
                                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                                '</div>'
                                    });
                                }, 400);
                            }
                        });
                    }
                }
            });
        });

    });

    /* Update New SubImg */
    $("#fs-product-update-page").on("click", ".fs-btn-edit-product-sub-img-form", function () {
        var btnStt = $(this).attr("fs-btn-edit-subimg-stt");
        var inputSubImg = $(this).parent().prev().find("input[name='fs-update-product-sub-img']");
        var subImgID = parseInt($(this).parent().parent().attr("fs-productSubImgID"));
        var api = $.fileuploader.getInstance(inputSubImg);
        if (btnStt == "save") {
            var newSubImg = inputSubImg.val();
            var changeThis = $(this).parent().siblings(".fs-update-sub-img-change-image-here");
            var currentForm = $(this).parents("form.fs-form-update-subimg")[0];
            if (newSubImg == "") {
                inputSubImg.parent().siblings(".fs-update-product-sub-img-error-mes").text("Please Choose an Image!");
                inputSubImg.focus();
            } else {
                var formData = new FormData();
                formData.append("subImgID", subImgID);
                formData.append("newImg", inputSubImg[0].files[0]);

                $.ajax({
                    url: "admin/ajax/changeSubImg.html",
                    method: "POST",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    beforeSend: function () {
                        $("#fs-ajax-loading").css("display", "block");
                    },
                    success: function (response) {
                        if (response != "fail") {
                            setTimeout(function () {
                                currentForm.reset();
                                changeThis.html("<img src=\"assets/images/products/subImg/" + response + "\" style=\"width: 80px\">");
                                $("#fs-ajax-loading").css("display", "none");

                                //Reset to begin
                                //btn edit
                                $(".fs-btn-edit-product-sub-img-form").attr("disabled", false);
                                $(".fs-btn-edit-product-sub-img-form").attr("fs-btn-edit-subimg-stt", "edit");
                                $(".fs-btn-edit-product-sub-img-form").removeClass("btn-primary");
                                $(".fs-btn-edit-product-sub-img-form").addClass("btn-warning");
                                $(".fs-btn-edit-product-sub-img-form").html("<i class=\"fa fa-wrench\" aria-hidden=\"true\"></i> Edit");

                                //btn delete
                                $(".fs-btn-delete-product-sub-img").attr("disabled", false);
                                $(".fs-btn-delete-product-sub-img").attr("fs-btn-delete-subimg-stt", "delete")
                                $(".fs-btn-delete-product-sub-img").removeClass("btn-default");
                                $(".fs-btn-delete-product-sub-img").addClass("btn-danger");
                                $(".fs-btn-delete-product-sub-img").html("<i class=\"fa fa-close\" aria-hidden=\"true\"></i> Delete");

                                api.disable();
                                $(".fs-update-product-sub-img-error-mes").text("");
                                $.notify({
                                    icon: 'glyphicon glyphicon-ok-sign',
                                    title: '<strong>Success!</strong>',
                                    message: 'Image was changed!.'
                                }, {
                                    type: 'success',
                                    placement: {
                                        from: 'top',
                                        align: 'right'
                                    },
                                    delay: 3400,
                                    timer: 200,
                                    mouse_over: 'pause',
                                    animate: {
                                        enter: 'animated fadeInRight',
                                        exit: 'animated fadeOutRight'
                                    },
                                    template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                            '<span data-notify="icon"></span> ' +
                                            '<span data-notify="title">{1}</span> ' +
                                            '<span data-notify="message">{2}</span>' +
                                            '<div class="progress" data-notify="progressbar">' +
                                            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                            '</div>' +
                                            '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                            '</div>'
                                });

                            }, 300);
                        } else {
                            $.notify({
                                icon: 'glyphicon glyphicon-warning-sign',
                                title: '<strong>Error!</strong>',
                                message: 'Change Image FAILED!, Please Refresh (F5) and do it again!.'
                            }, {
                                type: 'danger',
                                placement: {
                                    from: 'top',
                                    align: 'right'
                                },
                                delay: 3000,
                                timer: 200,
                                mouse_over: 'pause',
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                        '<span data-notify="icon"></span> ' +
                                        '<span data-notify="title">{1}</span> ' +
                                        '<span data-notify="message">{2}</span>' +
                                        '<div class="progress" data-notify="progressbar">' +
                                        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                        '</div>' +
                                        '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                        '</div>'
                            });
                        }
                    }
                });
            }
        } else {
            $(".fs-btn-edit-product-sub-img-form").attr("disabled", true);
            $(this).attr("fs-btn-edit-subimg-stt", "save");
            $(this).removeClass("btn-warning");
            $(this).addClass("btn-primary");
            $(this).html("<i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i> Save");
            $(this).attr("disabled", false);

            $(".fs-btn-delete-product-sub-img").attr("disabled", true);
            $(this).siblings("button").attr("fs-btn-delete-subimg-stt", "cancel");
            $(this).siblings("button").removeClass("btn-danger");
            $(this).siblings("button").addClass("btn-default");
            $(this).siblings("button").html("<i class=\"fa fa-refresh\" aria-hidden=\"true\"></i> Cancel");
            $(this).siblings("button").attr("disabled", false);

            var api = $.fileuploader.getInstance(inputSubImg);
            api.enable();
        }
    });

    $("#fs-product-update-page").on("click", ".fs-btn-delete-product-sub-img", function () {
        if ($(this).attr("fs-btn-delete-subimg-stt") == "cancel") {
            $(this).attr("fs-btn-delete-subimg-stt", "delete");
            $(this).removeClass("btn-default");
            $(this).addClass("btn-danger");
            $(this).html("<i class=\"fa fa-close\" aria-hidden=\"true\"></i> Delete");

            $(".fs-btn-delete-product-sub-img").attr("disabled", false);
            $(".fs-btn-edit-product-sub-img-form").attr("disabled", false);
            $(this).siblings("button").attr("fs-btn-edit-subimg-stt", "edit");
            $(this).siblings("button").removeClass("btn-primary");
            $(this).siblings("button").addClass("btn-warning");
            $(this).siblings("button").html("<i class=\"fa fa-wrench\" aria-hidden=\"true\"></i> Edit");

            $(".fs-update-product-sub-img-error-mes").text("");
            var inputSubImg = $(this).parent().prev().find("input[name='fs-update-product-sub-img']");
            var api = $.fileuploader.getInstance(inputSubImg);
            api.disable();
        } else {
            var subImgID = $(this).parent().parent().attr("fs-productSubImgID");
            var colorID = parseInt($("#fs-select-product-update-choose-color").val());
            $("#fs-update-product-confirm-delete-subImg").attr("data-1", subImgID);
            $("#fs-update-product-confirm-delete-subImg").modal("show");
        }
    });

    $("#fs-update-product-confirm-delete-subImg").on("click", ".btn-update-product-confirm-delete-subImg", function () {
        $("#fs-update-product-confirm-delete-subImg").modal("hide");
        var subImgID = $("#fs-update-product-confirm-delete-subImg").attr("data-1");
        var colorID = parseInt($("#fs-select-product-update-choose-color").val());
        $.ajax({
            url: "admin/ajax/deleteProductSubImg.html",
            method: "POST",
            data: {subImgID: subImgID, colorID: colorID},
            beforeSend: function () {
                $("#fs-ajax-loading").css("display", "block");
            },
            success: function (response) {
                if (response == "1") {
                    $.notify({
                        icon: 'glyphicon glyphicon-warning-sign',
                        title: '<strong>Error!</strong>',
                        message: 'Delete FAILED!, That Image is no longer existed!.'
                    }, {
                        type: 'danger',
                        placement: {
                            from: 'top',
                            align: 'right'
                        },
                        delay: 3000,
                        timer: 200,
                        mouse_over: 'pause',
                        animate: {
                            enter: 'animated fadeInRight',
                            exit: 'animated fadeOutRight'
                        },
                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                '<span data-notify="icon"></span> ' +
                                '<span data-notify="title">{1}</span> ' +
                                '<span data-notify="message">{2}</span>' +
                                '<div class="progress" data-notify="progressbar">' +
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                '</div>' +
                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                '</div>'
                    });
                } else if (response == "2") {
                    $.notify({
                        icon: 'glyphicon glyphicon-warning-sign',
                        title: '<strong>Error!</strong>',
                        message: 'Delete FAILED!, Please Refresh (F5) and do it again!.'
                    }, {
                        type: 'danger',
                        placement: {
                            from: 'top',
                            align: 'right'
                        },
                        delay: 3000,
                        timer: 200,
                        mouse_over: 'pause',
                        animate: {
                            enter: 'animated fadeInRight',
                            exit: 'animated fadeOutRight'
                        },
                        template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                '<span data-notify="icon"></span> ' +
                                '<span data-notify="title">{1}</span> ' +
                                '<span data-notify="message">{2}</span>' +
                                '<div class="progress" data-notify="progressbar">' +
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                '</div>' +
                                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                '</div>'
                    });
                } else {
                    setTimeout(function () {
                        $("#fs-edit-product-tbody-sub-img-" + colorID).html(response);
                        $("#fs-edit-product-tbody-sub-img-" + colorID + " input[name=\"fs-update-product-sub-img\"]").fileuploader({
                            limit: 1,
                            extensions: ['jpg', 'jpeg', 'png'],
                            enableApi: true
                        });
                        $("#fs-ajax-loading").css("display", "none");

                        $.notify({
                            icon: 'glyphicon glyphicon-ok-sign',
                            title: '<strong>Success!</strong>',
                            message: 'A Product Image was <b>deleted</b>!.'
                        }, {
                            type: 'success',
                            placement: {
                                from: 'top',
                                align: 'right'
                            },
                            delay: 3000,
                            timer: 200,
                            mouse_over: 'pause',
                            animate: {
                                enter: 'animated fadeInRight',
                                exit: 'animated fadeOutRight'
                            },
                            template: '<div data-notify="container" class="col-xs-11 col-sm-6 col-md-5 col-lg-3 alert alert-{0}" role="alert">' +
                                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                                    '<span data-notify="icon"></span> ' +
                                    '<span data-notify="title">{1}</span> ' +
                                    '<span data-notify="message">{2}</span>' +
                                    '<div class="progress" data-notify="progressbar">' +
                                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                    '</div>' +
                                    '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                    '</div>'
                        });
                    }, 400);
                }
            }
        });
    });

    $("#fs-product-update-page").on("change", ".fs-update-product-sub-img", function () {
        if ($(this).val() != "") {
            $(".fs-update-product-sub-img-error-mes").text("");
        }
    });

    /*==========================END VINH - PRODUCT============================*/

    /*=============================== THANH - BLOG =================================*/
    /*    
     * CẤU HÌNH DATEPICKER CHO BLOG
     */
//    $("#postedDate").datepicker({
//        showAnim: "drop",
//        dateFormat: "dd-mm-yy",
//        changeMonth: true,
//        changeYear: true
//    });
    /* BẮT validation CKSinder */

//    $("select#monthblog").selectBoxIt();

    /* BẮT validation CREATE BLOG CATEGORY */
    // blog-category-add
    $("#fs-button-create-blog-category").click(function (e) {
        e.preventDefault();
        var blogCateVal = $("#fs-blog-category").val().trim();
        if (blogCateVal == "") {
            $("#fs-blog-category-error").text("Category cannot be empty!");
        } else if (blogCateVal.length < 5 || blogCateVal.length > 20) {
            $("#fs-blog-category-error").text("Category has 5 - 20 characters!");
        } else {
            $("form[name=\"cateForm\"]").submit();
        }
    });

    $("#fs-blog-category").keyup(function (e) {
        var blogCateVal = $("#fs-blog-category").val().trim();
        if (blogCateVal == "") {
            $("#fs-blog-category-error").text("Category cannot be empty!");
        } else if (blogCateVal.length < 5 || blogCateVal.length > 20) {
            $("#fs-blog-category-error").text("Category has 5 - 20 characters!");
        }
        else {
            $("#fs-blog-category-error").text("");
        }
    });
    // blog-category-update
    $("#fs-button-update-blog-category").click(function (e) {
        e.preventDefault();
        var blogCateVal = $("#fs-blog-category-update").val().trim();

        if (blogCateVal == "") {
            $("#fs-blog-category-error").text("Category cannot be empty!");
        } else if (blogCateVal.length < 5 || blogCateVal.length > 20) {
            $("#fs-blog-category-error").text("Category has 5 - 20 characters!");
        } else {
            $("form[name=\"cateupdateForm\"]").submit();
        }
    });

    $("#fs-blog-category-update").keyup(function () {
        var blogCateVal = $("#fs-blog-category-update").val();
        if (blogCateVal == "") {
            $("#fs-blog-category-error").text("Category cannot be empty!");
        } else if (blogCateVal.length < 5 || blogCateVal.length > 20) {
            $("#fs-blog-category-error").text("Category has 5 - 20 characters!");
        } else {
            $("#fs-blog-category-error").text("");
        }
    });

    $('input[id="upImageBlog"]').fileuploader({
        limit: 1,
        extensions: ['jpg', 'jpeg', 'png'],
        dialogs: {
            // alert dialog
            alert: function (text) {
                $("#fs-error-mess-blog-img").text(text);
            }
        },
        thumbnails: {
            // Callback fired after the item image was loaded
            onImageLoaded: function (itemEl, listEl, parentEl, newInputEl, inputEl) {
                $("#fs-error-mess-blog-img").empty();
            }
        }
    });


    // blog-category-update-end
    /* BẮT validation CREATE BLOG */
    $("#fs-button-create-blog").click(function (e) {
        e.preventDefault();
        var categoryID = $("#fs-select-box-blog-category").val();
        var blogTitle = $("#fs-blog-line-title").val();
        var blogCateValSummary = $("#fs-blog-line-summary").val();
        var blogImg = $("#upImageBlog").val();
        var blogContent = $("editor1").val();
        if (categoryID == 0) {
            $("#fs-select-box-blog-category-error").text("Please select a Category!.");
        } else if (blogTitle == "" || blogTitle == (" ") < 0) {
            $("#fs-blog-title-error").text("Title cannot be empty!");
        }
        else if (blogTitle.length < 5 || blogTitle.length > 100) {
            $("#fs-blog-title-error").text("Title has 5 - 100 characters!");
        }
        else if (blogCateValSummary.length < 15 || blogCateValSummary.length > 1000) {
            $("#fs-blog-summary-error").text("Summary has 15 - 1000 characters!");
        }
        else if (blogCateValSummary == "" || blogCateValSummary == (" ") < 0) {
            $("#fs-blog-summary-error").text("Summary cannot be empty!");
        }
        else if (blogImg == "") {
            $("#fs-error-mess-blog-img").text("Image cannot be empty!");
        }
        else if (blogContent == "") {
            $("#fs-blog-content-error").text("Content cannot be empty!");
        }
        else {
            $("#fs-form-create-blog").submit();
        }
    });
//
    $("#fs-select-box-blog-category").change(function () {
        var categoryID = $("#fs-select-box-blog-category").val();
        if (categoryID == 0) {
            $("#fs-select-box-blog-category-error").text("Please select a Category!.");
        } else {
            $("#fs-select-box-blog-category-error").text("");
        }
    });

    $("#fs-blog-line-title").keyup(function () {
        var blogCateVal = $("#fs-blog-line-title").val();
        if (blogCateVal == "") {
            $("#fs-blog-title-error").text("Title cannot be empty!");
        } else if (blogCateVal.length < 5 || blogCateVal.length > 100) {
            $("#fs-blog-title-error").text("Title has 5 - 100 characters!");
        } else {
            $("#fs-blog-title-error").text("");
        }
    });

    $("#fs-blog-line-summary").keyup(function () {
        var blogCateValSummary = $("#fs-blog-line-summary").val();
        if (blogCateValSummary == "") {
            $("#fs-blog-summary-error").text("Summary cannot be empty!");
        } else if (blogCateValSummary.length < 5 || blogCateValSummary.length > 1000) {
            $("#fs-blog-summary-error").text("Summary has 15 - 1000 characters!");
        } else {
            $("#fs-blog-summary-error").text("");
        }
    });

    /* BẮT validation UPDATE BLOG */
    $("#fs-button-update-blog").click(function (e) {
        e.preventDefault();
        var categoryID = $("#fs-select-box-blog-category-update").val();
        var blogTitle = $("#fs-blog-update-line-title").val();
        var blogCateValSummary = $("#fs-blog-update-line-summary").val();
        if (categoryID == 0) {
            $("#fs-select-box-blog-category-error").text("Please select a Category!.");
        } else if (blogTitle == "" || blogTitle == (" ") < 0) {
            $("#fs-blog-title-error").text("Title cannot be empty!");
        }
        else if (blogTitle.length < 5 || blogTitle.length > 100) {
            $("#fs-blog-title-error").text("Title has 5 - 100 characters!");
        }
        else if (blogCateValSummary == "" || blogCateValSummary == (" ") < 0) {
            $("#fs-blog-summary-error").text("Summary cannot be empty!");
        }
        else if (blogCateValSummary.length < 15 || blogCateValSummary.length > 1000) {
            $("#fs-blog-summary-error").text("Summary has 15 - 1000 characters!");
        }
        else {
            $("#fs-form-update-blog").submit();
        }
    });

    $("#fs-select-box-blog-category-update").change(function () {
        var categoryID = $("#fs-select-box-blog-category-update").val();
        if (categoryID == 0) {
            $("#fs-select-box-blog-category-error").text("Please select a Category!.");
        } else {
            $("#fs-select-box-blog-category-error").text("");
        }
    });

    $("#fs-blog-update-line-title").keyup(function () {
        var blogCateVal = $("#fs-blog-update-line-title").val();
        if (blogCateVal == "") {
            $("#fs-blog-update-title-error").text("Title cannot be empty!");
        } else if (blogCateVal.length < 5 || blogCateVal.length > 100) {
            $("#fs-blog-update-title-error").text("Title has 5 - 100 characters!");
        } else {
            $("#fs-blog-update-title-error").text("");
        }
    });

    $("#fs-blog-update-line-summary").keyup(function () {
        var blogCateValSummary = $("#fs-blog-update-line-summary").val();
        if (blogCateValSummary == "") {
            $("#fs-blog-summary-error").text("Summary cannot be empty!");
        } else if (blogCateValSummary.length < 15 || blogCateValSummary.length > 1000) {
            $("#fs-blog-summary-error").text("Summary has 15 - 1000 characters!");
        } else {
            $("#fs-blog-summary-error").text("");
        }
    });
    $("#tableBlogList").DataTable({
        responsive: true,
        columnDefs: [{orderable: false, targets: 5}]
    });
    //blog-category-list.jsp
    $("#tableBlogCategory").DataTable({
        responsive: true,
        columnDefs: [{orderable: false, targets: 2}]
    });
    $('#confirm-blog-category-delete').on('show.bs.modal', function (e) {
        $(this).find('.btn-blog-cate-delete-ok').attr('href', $(e.relatedTarget).data('href'));
    });

    $('#confirm-blog-delete').on('show.bs.modal', function (e) {
        $(this).find('.btn-blog-delete-ok').attr('href', $(e.relatedTarget).data('href'));
    });

    $("#upImage").on('change', function () {
        if (typeof (FileReader) !== "undefined") {
            var image_holder = $("#image-load");
            image_holder.empty();

            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image"
                }).appendTo(image_holder);
            };
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        }
        else {
            alert("Your Browser does not support FileReader!.");
        }
    });

    /*===============================END THANH - BLOG =================================*/

    /*==============================DUONG - USER============================*/
    /* 
     * AJAX - EVENT ONCHANGE SELECT USER "STATUS" 
     */
    $(".fs-select-user-status").on("change", function () {
        var status = $(this).val();
        var userID = $(this).attr("fs-user");

        $.ajax({
            url: "admin/user/updateStatus.html",
            method: "POST",
            data: {userID: userID, status: status},
            success: function (response) {
//                swal("UPDATE SUCCESS", response, "success");
                swal({
                    type: "success",
                    title: "UPDATE SUCCESS",
                    text: response,
                    timer: 2000,
                    showConfirmButton: false
                });

            }
        });
    });

//    document.getElementById('fs-status-1').onclick = function(){
//    swal("Good job!", "You clicked the button!", "success");
//};

    /* 
     * AJAX - EVENT ONCHANGE SELECT USER "ROLE" 
     */
    $(".fs-select-user-role").on("change", function () {
        var roleID = $(this).val();
        var userID = $(this).attr("fs-user");



        $.ajax({
            url: "admin/user/usersrole/edit.html",
            method: "POST",
            data: {userID: userID, roleID: roleID},
            success: function (response) {
//                swal("UPDATE SUCCESS", response, "success");
                swal({
                    type: "success",
                    title: "UPDATE SUCCESS",
                    text: response,
                    timer: 2000,
                    showConfirmButton: false
                });


            }
        });
    });


    /*
     * FORMATTING FUNCTION FOR ROW DETAIL - MODIFY AS YOU NEED
     */

    var fs_user_table = $("#fs-user-dataTables").DataTable({//cấu hình datatable chính chủ.
        responsive: true
    });

    //function load data từ 1 dataSource lên table
//    function renderTableFromJson(json) {
//        var beginStr = '<table class="table table-striped table table-bordered table table-hover" >' +
//                '<tr>' +
//                '<th>Address</th>' +
//                '<th>Phone</th>' +
//                '</tr>';
//
//        var endStr = '</table>';
//        var dataStr = '';
//
//        //vòng lặp foreach của jquery
//        $.each(json, function (i, item) { //i: index; item: từng object
//            dataStr += '<tr>' +
//                    '<td>' + item.address + '</td>' +
//                    '<td>' + item.phoneNumber + '</td>' +
//                    '</tr>';
//        });
//
//        return beginStr + dataStr + endStr;
//    }


    //Test thử table khác

    function renderTableFromJson(json) {
        var beginStr = '<table class="heavyyTable" style="width: 100%;border: 1px solid #38678f;max-width: 500px; height: 20px; border-collapse: collapse;margin: 10px auto;background: white;" >' +
                '<tr id="fs-tr" style="border-bottom: 1px solid #cccccc;">' +
                '<th class="text-center" id="fs-th" style="background: steelblue;height: 54px;width: 25%;font-weight: lighter;text-shadow: 0 1px 0 #38678f;color: white;border: 1px solid #38678f;box-shadow: inset 0px 1px 2px #568ebd;transition: all 0.2s;">Address</th>' +
                '<th class="text-center" id="fs-th" style="background: steelblue;height: 54px;width: 25%;font-weight: lighter;text-shadow: 0 1px 0 #38678f;color: white;border: 1px solid #38678f;box-shadow: inset 0px 1px 2px #568ebd;transition: all 0.2s;">Phone</th>' +
                '</tr>';

        var endStr = '</table>';
        var dataStr = '';

        //vòng lặp foreach của jquery
        $.each(json, function (i, item) { //i: index; item: từng object
            dataStr += '<tbody id="fs-tbody">' +
                    '<tr id="fs-tr" style="border-bottom: 1px solid #cccccc;">' +
                    '<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + item.address + '</td>' +
                    '<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + item.phoneNumber + '</td>' +
                    '</tr>' +
                    '</tbody>';
        });

        return beginStr + dataStr + endStr;
    }

    function UserIDTableFromJson(json) {
        var beginStr = '<table class="heavyTable" style="width: 40%;border: 1px solid #38678f;max-width: 380px; height: 20px; border-collapse: collapse;background: white;" >' +
                '<tr id="fs-tr" style="border-bottom: 1px solid #cccccc;">' +
                '<th class="text-center" id="fs-th" style="background: steelblue;height: 54px;width: 25%;font-weight: lighter;text-shadow: 0 1px 0 #38678f;color: white;border: 1px solid #38678f;box-shadow: inset 0px 1px 2px #568ebd;transition: all 0.2s;">First Name</th>' +
                '<th class="text-center" id="fs-th" style="background: steelblue;height: 54px;width: 25%;font-weight: lighter;text-shadow: 0 1px 0 #38678f;color: white;border: 1px solid #38678f;box-shadow: inset 0px 1px 2px #568ebd;transition: all 0.2s;">Last Name</th>' +
                '<th class="text-center" id="fs-th" style="background: steelblue;height: 54px;width: 25%;font-weight: lighter;text-shadow: 0 1px 0 #38678f;color: white;border: 1px solid #38678f;box-shadow: inset 0px 1px 2px #568ebd;transition: all 0.2s;">Birth Day</th>' +
                '<th class="text-center" id="fs-th" style="background: steelblue;height: 54px;width: 25%;font-weight: lighter;text-shadow: 0 1px 0 #38678f;color: white;border: 1px solid #38678f;box-shadow: inset 0px 1px 2px #568ebd;transition: all 0.2s;">Resgistraion Date</th>' +
                '</tr>';

        var endStr = '</table>';
        var dataStr = '';

        //vòng lặp foreach của jquery
        $.each(json, function (i, item) { //i: index; item: từng object
            var jsonStringBD = item.birthday;
            var jsonObjectBD = JSON.parse(jsonStringBD);
            var newFormattedDateBD = $.datepicker.formatDate('dd/mm/yy', new Date(jsonObjectBD));
            var jsonStringRG = item.registrationDate;
            var jsonObjectRG = JSON.parse(jsonStringRG);
            var newFormattedDateRG = $.datepicker.formatDate('dd/mm/yy', new Date(jsonObjectRG));
            dataStr += '<tbody id="fs-tbody">' +
                    '<tr id="fs-tr" style="border-bottom: 1px solid #cccccc;">' +
                    '<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + item.firstName + '</td>' +
                    '<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + item.lastName + '</td>' +
                    '<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + newFormattedDateBD + '</td>' +
                    '<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + newFormattedDateRG + '</td>' +
                    '</tr>' +
                    '</tbody>';
        });

        return beginStr + dataStr + endStr;
    }

    $("#fs-user-dataTables").on("click", ".fs-user-dataTable-control-button", function () {
        var userID = $(this).attr("fs-userID");
        var tr = $(this).closest('tr');
        var row = fs_user_table.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            //Gọi Ajax
            $.ajax({
                url: "admin/user/ajax/getUserAddress.html",
                method: "POST",
                data: {userID: userID},
                dataType: "JSON",
                success: function (response) {
                    for (var i = 0; i < response.length; i++) {
                        var item = response[i];
                        if (item != null) {
                            row.child(renderTableFromJson(response)).show();
                        }
                    }
                }
            });
            tr.addClass('shown');
        }
    });

    // HIỂN THỊ BẢNG THÔNG TIN CỦA USER
    $("#fs-user-dataTables tbody").on("click", ".fs-detail-user", function () {
        var userID = $(this).attr("fs-userID");

        $.ajax({
            url: "admin/user/ajax/getUsersByID.html",
            method: "POST",
            data: {userID: userID},
            dataType: "JSON",
            success: function (response) {
                console.log(response);
                //vòng lặp foreach của jquery
                var jsonStringBD = response[0].birthday;
                var jsonObjectBD = JSON.parse(jsonStringBD);
                var newFormattedDateBD = $.datepicker.formatDate('dd/mm/yy', new Date(jsonObjectBD));
                var jsonStringRG = response[0].registrationDate;
                var jsonObjectRG = JSON.parse(jsonStringRG);
                var newFormattedDateRG = $.datepicker.formatDate('dd/mm/yy', new Date(jsonObjectRG));
//                    var dataStr = $('');
//                    $(dataStr).append('<tr id="fs-tr" style="border-bottom: 1px solid #cccccc;">');
//                    $(dataStr).append('<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + item.firstName + '</td>');
//                    $(dataStr).append('<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + item.lastName + '</td>');
//                    $(dataStr).append('<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + newFormattedDateBD + '</td>');
//                    $(dataStr).append('<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + newFormattedDateRG + '</td>');
//                    $(dataStr).append('</tr>');

//                    $(".heavyTable").append(dataStr);
                var dataStr = "";
                dataStr += '<tr id="fs-tr" style="border-bottom: 1px solid #cccccc;">' +
                        '<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + response[0].firstName + '</td>' +
                        '<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + response[0].lastName + '</td>' +
                        '<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + newFormattedDateBD + '</td>' +
                        '<td class="text-center" id="fs-td" style="border-right: 1px solid #cccccc;padding: 10px;transition: all 0.2s;">' + newFormattedDateRG + '</td>' +
                        '</tr>';
                $("#fs-tbody-table-in-user-detail-info").html(dataStr);
                $('#fs-user-detail-info').modal('show');

//    var beginStr = '<table class="table">' ;
//    var endStr = '</table>';
//    var dataStr ='';
//                swal({
//                    title: "",
//                    text:beginStr + dataStr + endStr ,
//                    timer: 4000,
//                    showConfirmButton: false
//                        });
            }
//            
//            
        });
    });


    // BẮT VALIDATION FORM ADD ROLE BẰNG CLICK

    $("#fs-button-create-role").click(function (e) {
        e.preventDefault();
        var roleName = $("#fs-roleName-create").val().trim();
        if (roleName == "") {
            $("#fs-create-roleName-error").text("Role Name cannot be empty!");
            var div = $("#fs-roleName-create").closest("div.fs-aaa");
            div.removeClass("has-success");
            $("#glypcn-fs-roleName-create").remove();
            div.addClass("has-error has-feedback");
            div.append('<span id="glypcn-fs-roleName-create" class="glyphicon glyphicon-remove form-control-feedback"></span>');
            return false;
        } else if (roleName.length < 2 || roleName.length > 25) {
            $("#fs-create-roleName-error").text("Role Name has 2 - 25 characters!");
            var div = $("#fs-roleName-create").closest("div.fs-aaa");
            div.removeClass("has-success");
            $("#glypcn-fs-roleName-create").remove();
            div.addClass("has-error has-feedback");
            div.append('<span id="glypcn-fs-roleName-create" class="glyphicon glyphicon-remove form-control-feedback"></span>');
            return false;
        }
        else {
            $("#fs-form-create-role").submit();
            var div = $("#fs-roleName-create").closest("div.fs-aaa");
            div.removeClass("has-error");
            div.addClass("has-success has-feedback");
            $("#glypcn-fs-roleName-create").remove();
            div.append('<span id="glypcn-fs-roleName-create" class="glyphicon glyphicon-ok form-control-feedback"></span>');
            return true;
        }
    });

    // KIỂM TRA ROLENAME TỒN TẠI CLICK CREATE
//    function checkRole(roleName) {
////        $("#fs-roleName-create").click(function(){
//        var roleName = $("#fs-roleName-create").val();
//        $.ajax({
//            url: "admin/user/checkRoleName.html",
//            method: "POST",
////                data: {},
//            dataType: "JSON",
//            success: function (response) {
//                for (var i = 0; i < response.length; i++) {
//                    var item = response[i];
//                    alert(item);
////                    if (roleName === item) {
////                        $("#fs-create-roleName-error").text("Role Name exist!");
////                        var div = $("#fs-roleName-create").closest("div.fs-aaa");
////                        div.removeClass("has-success");
////                        $("#glypcn-fs-roleName-create").remove();
////                        div.addClass("has-error has-feedback");
////                        div.append('<span id="glypcn-fs-roleName-create" class="glyphicon glyphicon-remove form-control-feedback"></span>');
////                        return false;
////                    }
//                }
//            }
//        });
//    });

//    BẮT VALIDATION FORM ADD ROLE BẰNG KEYUP
    $("#fs-roleName-create").keyup(function () {
        var roleName = $("#fs-roleName-create").val().trim();
        if (roleName == "") {
            $("#fs-create-roleName-error").text("Role Name cannot be empty!");
            var div = $("#fs-roleName-create").closest("div.fs-aaa");
            div.removeClass("has-success");
            $("#glypcn-fs-roleName-create").remove();
            div.addClass("has-error has-feedback");
            div.append('<span id="glypcn-fs-roleName-create" class="glyphicon glyphicon-remove form-control-feedback"></span>');
            return false;
        } else if (roleName.length < 2 || roleName.length > 25) {
            $("#fs-create-roleName-error").text("Role Name has 2 - 25 characters!");
            var div = $("#fs-roleName-create").closest("div.fs-aaa");
            div.removeClass("has-success");
            $("#glypcn-fs-roleName-create").remove();
            div.addClass("has-error has-feedback");
            div.append('<span id="glypcn-fs-roleName-create" class="glyphicon glyphicon-remove form-control-feedback"></span>');
            return false;
        } else {
            $("#fs-create-roleName-error").text("");
            var div = $("#fs-roleName-create").closest("div.fs-aaa");
            div.removeClass("has-error");
            div.addClass("has-success has-feedback");
            $("#glypcn-fs-roleName-create").remove();
            div.append('<span id="glypcn-fs-roleName-create" class="glyphicon glyphicon-ok form-control-feedback"></span>');
            return true;
        }
    });

    // XỬ LÝ TRÙNG ROLENAME VỚI KEYUP CREATE
    $("#fs-roleName-create").keyup(function () {
        var roleName = $("#fs-roleName-create").val().trim();
        $.ajax({
            url: "admin/user/checkRoleName.html",
            method: "POST",
//                data: {},
            dataType: "JSON",
            success: function (response) {
                for (var i = 0; i < response.length; i++) {
                    var item = response[i];
                    if (roleName == item) {
                        $("#fs-create-roleName-error").text("Role Name exist!");
                        var div = $("#fs-roleName-create").closest("div.fs-aaa");
                        div.removeClass("has-success");
                        $("#glypcn-fs-roleName-create").remove();
                        div.addClass("has-error has-feedback");
                        div.append('<span id="glypcn-fs-roleName-create" class="glyphicon glyphicon-remove form-control-feedback"></span>');
                        return false;
                    }
                }
            }
        });
    });

    // BẮT VALIDATION FORM UPDATE ROLE

    $("#fs-button-update-role").click(function (e) {
        e.preventDefault();
        var roleName = $("#fs-roleName-update").val().trim();
        if (roleName == "") {
            $("#fs-update-roleName-error").text("Role Name cannot be empty!");
            var div = $("#fs-roleName-update").closest("div.fa-ccc");
            div.removeClass("has-success");
            $("#glypcn-fs-roleName-update").remove();
            div.addClass("has-error has-feedback");
            div.append('<span id="glypcn-fs-roleName-update" class="glyphicon glyphicon-remove form-control-feedback"></span>');
            return false;
        } else if (roleName.length < 2 || roleName.length > 25) {
            $("#fs-update-roleName-error").text("Role Name has 2 - 25 characters!");
            var div = $("#fs-roleName-update").closest("div.fa-ccc");
            div.removeClass("has-success");
            $("#glypcn-fs-roleName-update").remove();
            div.addClass("has-error has-feedback");
            div.append('<span id="glypcn-fs-roleName-update" class="glyphicon glyphicon-remove form-control-feedback"></span>');
            return false;
        }
        else {
            $("#fs-form-update-role").submit();
            var div = $("#fs-roleName-update").closest("div.fa-ccc");
            div.removeClass("has-error");
            div.addClass("has-success has-feedback");
            $("#glypcn-fs-roleName-update").remove();
            div.append('<span id="glypcn-fs-roleName-update" class="glyphicon glyphicon-ok form-control-feedback"></span>');
            return true;

        }

    });

    $("#fs-roleName-update").keyup(function () {
        var roleName = $("#fs-roleName-update").val().trim();
        if (roleName == "") {
            $("#fs-update-roleName-error").text("Role Name cannot be empty!");
            var div = $("#fs-roleName-update").closest("div.fa-ccc");
            div.removeClass("has-success");
            $("#glypcn-fs-roleName-update").remove();
            div.addClass("has-error has-feedback");
            div.append('<span id="glypcn-fs-roleName-update" class="glyphicon glyphicon-remove form-control-feedback"></span>');
            return false;
        } else if (roleName.length < 2 || roleName.length > 25) {
            $("#fs-update-roleName-error").text("Role Name has 2 - 25 characters!");
            var div = $("#fs-roleName-update").closest("div.fa-ccc");
            div.removeClass("has-success");
            $("#glypcn-fs-roleName-update").remove();
            div.addClass("has-error has-feedback");
            div.append('<span id="glypcn-fs-roleName-update" class="glyphicon glyphicon-remove form-control-feedback"></span>');
            return false;
        } else {
            $("#fs-update-roleName-error").text("");
            var div = $("#fs-roleName-update").closest("div.fa-ccc");
            div.removeClass("has-error");
            div.addClass("has-success has-feedback");
            $("#glypcn-fs-roleName-update").remove();
            div.append('<span id="glypcn-fs-roleName-update" class="glyphicon glyphicon-ok form-control-feedback"></span>');
            return true;
        }
    });

    // XỬ LÝ TRÙNG ROLENAME VỚI KEYUP UPDATE
    $("#fs-roleName-update").keyup(function () {
        var roleName = $("#fs-roleName-update").val().trim();
        $.ajax({
            url: "admin/user/checkRoleName.html",
            method: "POST",
//                data: {},
            dataType: "JSON",
            success: function (response) {
                for (var i = 0; i < response.length; i++) {
                    var item = response[i];
                    if (roleName == item) {
                        $("#fs-update-roleName-error").text("Role Name exist!");
                        var div = $("#fs-roleName-update").closest("div.fa-ccc");
                        div.removeClass("has-success");
                        $("#glypcn-fs-roleName-update").remove();
                        div.addClass("has-error has-feedback");
                        div.append('<span id="glypcn-fs-roleName-update" class="glyphicon glyphicon-remove form-control-feedback"></span>');
                        return false;
                    }
                }
            }
        });
    });
    // XỬ LÝ NÚT XÓA

    $(".fs-button-detele-role").click(function () {
        var roleID = $(this).attr("fs-roleID");
//        alert(roleID);

        swal({
            title: "Are you sure?",
            text: "You will sure delete record this",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete!",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false
        },
        function (isConfirm) {
            if (!isConfirm)
                return;
            $.ajax({
                url: "admin/user/role/delete/" + roleID + ".html",
                type: "POST",
                data: {
                    roleID: roleID
                },
//            dataType: "html",
                success: function (response) {
                    swal("Done!", "It was succesfully deleted!", "success");
                    window.location = window.location.href;
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    swal("Error deleting!", "Please try again", "error");
                }
            });
        });
    });

//    $(".fs-button-detele-role").prop('disable', true);

//    $

    /*==============================END DUONG - USER============================*/

    /*==============================NGAN - ORDER============================*/
    //Thiết lập cho bảng order list
    $('#tableOrder').DataTable({
        responsive: true,
        order: [[4, "desc"]],
        columnDefs: [{"orderable": false, "targets": [2, 3, 5]}] //,{"targets":4,render: $.fn.dataTable.render.moment(dd/mm/yyyy)}
    });

    //Thiết lập cho bảng order details list
    $('#tableOrderDetails').DataTable({
        responsive: true,
        columnDefs: [{"orderable": false, "targets": [2, 3, 8]}]
    });

    //Thiết lập cho bảng discount list
    $('#tableDiscountList').DataTable({
        responsive: true,
        columnDefs: [{"orderable": false, "targets": [5, 6]}],
        order: [[0, "ASC"]]
    });

    //discount-add.jsp
    $("#fs-form-create-discount #beginDate").datepicker({
        showAnim: "drop",
        dateFormat: "dd-mm-yy",
        changeMonth: true,
        changeYear: true,
        yearRange: new Date().getFullYear().toString() + ":" + (new Date().getFullYear() + 2).toString(),
        minDate: new Date(),
        onSelect: function () {
            $('#error-discount-add').html("");
            $("#fs-form-create-discount #endDate").datepicker("option", "minDate", $('input[name=beginDate]').val());
        }
    });
    $("#fs-form-create-discount #endDate").datepicker({
        showAnim: "drop",
        dateFormat: "dd-mm-yy",
        changeMonth: true,
        changeYear: true,
        yearRange: new Date().getFullYear().toString() + ":" + (new Date().getFullYear() + 2).toString(),
        minDate: new Date(),
        onSelect: function () {
            $('#error-discount-add').html("");
        }
    });
    $('#btn-create-discount').on("click", function (e) {
        e.preventDefault();
        var errorHead = "<div class=\"alert alert-danger\"><strong>";
        var errorFoot = "</strong></div>";
        var voucherID = $('input[name=voucherID]').val().trim();
        var discount = $('input[name=discount]').val().trim();
        var quantity = $('input[name=quantity]').val().trim();
//        var beginDate = $('input[name=beginDate]').val();
//        var endDate = $('input[name=endDate]').val();
        var description = $('input[name=description]').val().trim();
        if (voucherID == "") {
            $('#error-discount-add').html(errorHead + "VOUCHER CODE REQUIRED" + errorFoot);
        } else if (discount == "") {
            $('#error-discount-add').html(errorHead + "DISCOUNT REQUIRED" + errorFoot);
        } else if (!discount.match('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)') || discount.match(',')) { //^[0-9]*$
            $('#error-discount-add').html(errorHead + "DISCOUNT MUST BE NUMBER (Eg: 30, 30.5,...)" + errorFoot);
        } else if (discount <= 0 || discount > 100) {
            $('#error-discount-add').html(errorHead + "DISCOUNT RANGE 0 TO 100" + errorFoot);
        } else if (quantity == "") {
            $('#error-discount-add').html(errorHead + "QUANTITY REQUIRED" + errorFoot);
        } else if (!quantity.match('^[0-9]*$')) { //[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)
            $('#error-discount-add').html(errorHead + "QUANTITY MUST BE NUMBER" + errorFoot);
        } else if (description.length > 500) {
            $('#error-discount-add').html(errorHead + "DESCRIPTION LENGTH MAXIMUM 500" + errorFoot);
        } else {
            $('#fs-form-create-discount').submit();
        }
    });
    $('#fs-form-create-discount input[name=voucherID]').keyup(function () {
        $('#error-discount-add').html("");
    });
    $('#fs-form-create-discount input[name=discount]').keyup(function () {
        $('#error-discount-add').html("");
    });
    $('#fs-form-create-discount input[name=quantity]').keyup(function () {
        $('#error-discount-add').html("");
    });
    $('#fs-form-create-discount input[name=description]').keyup(function () {
        $('#error-discount-add').html("");
    });
    //discount-update.jsp
    $("#fs-form-update-discount #beginDate").datepicker({
        showAnim: "drop",
        dateFormat: "dd-mm-yy",
        changeMonth: true,
        changeYear: true,
        yearRange: new Date().getFullYear().toString() + ":" + (new Date().getFullYear() + 2).toString(),
        minDate: new Date(),
        onSelect: function () {
            $('#error-discount-update').html("");
            $("#fs-form-update-discount #endDate").datepicker("option", "minDate", $('input[name=beginDate]').val());
        }
    });
    $("#fs-form-update-discount #endDate").datepicker({
        showAnim: "drop",
        dateFormat: "dd-mm-yy",
        changeMonth: true,
        changeYear: true,
        yearRange: new Date().getFullYear().toString() + ":" + (new Date().getFullYear() + 2).toString(),
        minDate: new Date(),
        onSelect: function () {
            $('#error-discount-update').html("");
        }
    });
    $('#btn-update-discount').on("click", function (e) {
        e.preventDefault();
        var errorHead = "<div class=\"alert alert-danger\"><strong>";
        var errorFoot = "</strong></div>";
        var discount = $('input[name=discount]').val().trim();
        var quantity = $('input[name=quantity]').val().trim();
        var description = $('input[name=description]').val().trim();
        if (discount == "") {
            $('#error-discount-update').html(errorHead + "DISCOUNT REQUIRED" + errorFoot);
        } else if (!discount.match('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)') || discount.match(',')) { //^[0-9]*$
            $('#error-discount-update').html(errorHead + "DISCOUNT MUST BE NUMBER (Eg: 30, 30.5,...)" + errorFoot);
        } else if (discount <= 0 || discount > 100) {
            $('#error-discount-update').html(errorHead + "DISCOUNT RANGE 0 TO 100" + errorFoot);
        } else if (quantity == "") {
            $('#error-discount-update').html(errorHead + "QUANTITY REQUIRED" + errorFoot);
        } else if (!quantity.match('^[0-9]*$')) { //[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)
            $('#error-discount-update').html(errorHead + "QUANTITY MUST BE NUMBER" + errorFoot);
        } else if (description.length > 500) {
            $('#error-discount-update').html(errorHead + "DESCRIPTION LENGTH MAXIMUM 500" + errorFoot);
        } else {
            $('#fs-form-update-discount').submit();
        }
    });
    $('#fs-form-update-discount input[name=voucherID]').keyup(function () {
        $('#error-discount-update').html("");
    });
    $('#fs-form-update-discount input[name=discount]').keyup(function () {
        $('#error-discount-update').html("");
    });
    $('#fs-form-update-discount input[name=quantity]').keyup(function () {
        $('#error-discount-update').html("");
    });
    $('#fs-form-update-discount input[name=description]').keyup(function () {
        $('#error-discount-update').html("");
    });

    //discount-list.jsp
    $('#confirm-discount-delete').on('show.bs.modal', function (e) {
        $(this).find('.btn-discount-delete-ok').attr('href', $(e.relatedTarget).data('href'));
    });

    //Order-list-detail-add.jsp
    $('#tableProductOrderDetailAdd').DataTable({
        responsive: true,
        order: [[0, "asc"]],
        paginate: false,
        filter: false,
        info: false,
        sort: false,
        scrollY: 195,
        deferRender: true,
        scroller: true
    });
    $('#tableProductOrderDetailAdd tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $(this).prop("style", false);
            $("#productOrDetailAddColor").html("");
            $("#productOrDetailAddSize").html("");
            $("#error-orderDetail-add").html("");
        } else {
            $("#error-orderDetail-add").html("");
            $("#productOrDetailAddColor").html("");
            $("#productOrDetailAddSize").html("");
            $('tr.selected').prop("style", false);
            $('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $(this).css("background-color", "skyblue");
            var productID = $("tr.selected .proID")[0].innerHTML;
            $.ajax({
                url: "admin/orders/ajax/searchcolor.html",
                method: "POST",
                data: {productID: productID},
                dataType: 'html',
                success: function (response) {
                    $("#productOrDetailAddColor").html(response);
                }
            });
        }
    });
    $('select[name=productOrDetailAddColor]').on("change", function () {
        $("#error-orderDetail-add").html("");
        var colorID = $("select[name=productOrDetailAddColor]").val();
        $.ajax({
            url: "admin/orders/ajax/searchsize.html",
            method: "POST",
            data: {colorID: colorID},
            dataType: 'html',
            success: function (response) {
                $("#productOrDetailAddSize").html(response);
            }
        });
    });
    $('select[name=productOrDetailAddSize]').on("change", function () {
        $("#error-orderDetail-add").html("");
    });
    $("#searchText").keypress(function (e) {
        if (e.which == 13) {
            var errorHead = "<div class=\"alert alert-danger\"><strong>";
            var errorFoot = "</strong></div>";
            var searchType = $('#searchType').val();
            var searchText = $('#searchText').val().trim();
            if (searchType == 1) { //ProductName
                if (searchText == "") {
                    $("#error-orderDetail-add").html(errorHead + "PLEASE ENTER PRODUCT NAME" + errorFoot);
                } else {
                    $.ajax({
                        url: "admin/orders/ajax/searchproduct.html",
                        method: "POST",
                        data: {searchType: searchType, searchText: searchText},
                        dataType: 'html',
                        success: function (response) {
                            if (response === "0") {
                                $("#error-orderDetail-add").html(errorHead + "PRODUCT NAME ERROR" + errorFoot);
                            } else {
                                $(".bodyProductOrDetailAdd").html(response);
                                $('.dataTables_scrollBody table').css("width", "922px")
                            }
                        }
                    });
                }
            } else { //Product ID
                if (searchText == "") {
                    $("#error-orderDetail-add").html(errorHead + "PLEASE ENTER PRODUCT ID" + errorFoot);
                } else if (!$.isNumeric(searchText)) {
                    $("#error-orderDetail-add").html(errorHead + "PLEASE ENTER PRODUCT ID IN NUMBER" + errorFoot);
                } else {
                    $.ajax({
                        url: "admin/orders/ajax/searchproduct.html",
                        method: "POST",
                        data: {searchType: searchType, searchText: searchText},
                        dataType: 'html',
                        success: function (response) {
                            if (response == "0") {
                                $("#error-orderDetail-add").html(errorHead + "PRODUCT NOT EXIST" + errorFoot);
                            } else {
                                $(".bodyProductOrDetailAdd").html(response);
                            }
                        }
                    });
                }
            }
        }
    });
    $("#btnSearchProduct").on("click", function () {
        var errorHead = "<div class=\"alert alert-danger\"><strong>";
        var errorFoot = "</strong></div>";
        var searchType = $('#searchType').val();
        var searchText = $('#searchText').val().trim();
        if (searchType == 1) { //ProductName
            if (searchText == "") {
                $("#error-orderDetail-add").html(errorHead + "PLEASE ENTER PRODUCT NAME" + errorFoot);
            } else {
                $.ajax({
                    url: "admin/orders/ajax/searchproduct.html",
                    method: "POST",
                    data: {searchType: searchType, searchText: searchText},
                    dataType: 'html',
                    success: function (response) {
                        if (response == "0") {
                            $("#error-orderDetail-add").html(errorHead + "PRODUCT NAME ERROR" + errorFoot);
                        } else {
                            $(".bodyProductOrDetailAdd").html(response);
                            $('.dataTables_scrollBody table').css("width", "922px")
                        }
                    }
                });
            }
        } else { //Product ID
            if (searchText == "") {
                $("#error-orderDetail-add").html(errorHead + "PLEASE ENTER PRODUCT ID" + errorFoot);
            } else if (!$.isNumeric(searchText)) {
                $("#error-orderDetail-add").html(errorHead + "PLEASE ENTER PRODUCT ID IN NUMBER" + errorFoot);
            } else {
                $.ajax({
                    url: "admin/orders/ajax/searchproduct.html",
                    method: "POST",
                    data: {searchType: searchType, searchText: searchText},
                    dataType: 'html',
                    success: function (response) {
                        if (response == "0") {
                            $("#error-orderDetail-add").html(errorHead + "PRODUCT NOT EXIST" + errorFoot);
                        } else {
                            $(".bodyProductOrDetailAdd").html(response);
                        }
                    }
                });
            }
        }
    });
    $('#btnAddOrderDetail').on("click", function () {
        var errorHead = "<div class=\"alert alert-danger\"><strong>";
        var errorFoot = "</strong></div>";
        if ($("tr.selected .proID")[0] == null) {
            $("#error-orderDetail-add").html(errorHead + "PLEASE SEARCH AND CHOOSE PRODUCT" + errorFoot);
        } else {
            var orderID = $("#productOrDetailAddHeader").attr("fs-order-id");
            var productID = $("tr.selected .proID")[0].innerHTML;
            var colorID = $("select[name=productOrDetailAddColor]").val();
            var sizeID = $("select[name=productOrDetailAddSize]").val();
            var quantity = $("input[name=productOrDetailAddQuantity]").val().trim();
            if (colorID == null || colorID == 0) {
                $("#error-orderDetail-add").html(errorHead + "PLEASE CHOOSE COLOR" + errorFoot);
            } else if (sizeID == null || sizeID == 0) {
                $("#error-orderDetail-add").html(errorHead + "PLEASE CHOOSE SIZE" + errorFoot);
            } else if (quantity == "") {
                $("#error-orderDetail-add").html(errorHead + "PLEASE ENTER QUANTITY" + errorFoot);
            } else if (quantity < 1 || quantity > 10) {
                $("#error-orderDetail-add").html(errorHead + "QUANTITY MUST 1 TO 10" + errorFoot);
            } else {
                $.ajax({
                    url: "admin/orders/ajax/addOrderDetail.html",
                    method: "POST",
                    data: {orderID: orderID,
                        productID: productID,
                        colorID: colorID,
                        sizeID: sizeID,
                        quantity: quantity},
                    dataType: 'html',
                    success: function (response) {
                        if (response == "2") {
                            $("#error-orderDetail-add").html(errorHead + "ERROR" + errorFoot);
                        } else if (response == "0") {
                            $("#error-orderDetail-add").html(errorHead + "OUT OF STOCK! CHOSE ANOTHER COLOR AND SIZE." + errorFoot);
                        } else {
                            window.location = "admin/orders/orderlistdetail/" + orderID + ".html";
                        }
                    }
                });
            }
        }
    });
    $("#searchText").keypress(function (e) {
        if (e.which != 13) {
            $("#error-orderDetail-add").html("");
        }
    });
    $('input[name=productOrDetailAddQuantity]').keypress(function () {
        $("#error-orderDetail-add").html("");
    });

    //orders-chart.jsp
    $('select[name=order-chart-year]').on("change", function () {
        $('#day-money-order-chart').remove();
        $('#day-money-order-chart-div').html("<div id=\"day-money-order-chart\" ></div>");
    });
    if (window.location.href.includes("orderchart")) {
        $.ajax({
            url: "admin/orders/ajax/orderDonutQuantitySubcategory.html",
            method: "GET",
            dataType: 'JSON',
            success: function (response) {
                Morris.Donut({
                    element: 'donut-chart-subcategory',
                    data: response
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
        $.ajax({
            url: "admin/orders/ajax/orderDonutQuantityCategory.html",
            method: "GET",
            dataType: 'JSON',
            success: function (response) {
                Morris.Donut({
                    element: 'donut-chart-category',
                    data: response
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
        $.ajax({
            url: "admin/orders/ajax/orderDonutMoneyCategory.html",
            method: "GET",
            dataType: 'JSON',
            success: function (response) {
                Morris.Donut({
                    element: 'donut-chart-category-money',
                    data: response,
                    formatter: function (y, data) {
                        return '$' + y
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
        $.ajax({
            url: "admin/orders/ajax/orderDonutMoneySubcategory.html",
            method: "GET",
            dataType: 'JSON',
            success: function (response) {
                Morris.Donut({
                    element: 'donut-chart-subcategory-money',
                    data: response,
                    formatter: function (y, data) {
                        return '$' + y
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
        var year = $('#order-chart-year').val();
        $.ajax({
            url: "admin/orders/ajax/getMonthOrderedByYear.html",
            method: "GET",
            data: {year: year},
            dataType: 'JSON',
            success: function (response) {
                for (var i = 0, max = 12; i < max; i++) {
                    $("#btn-order-month-" + (i + 1).toString()).attr("disabled", "disabled");
                }
                $.each(response, function (i, item) {
                    $("#btn-order-month-" + item).removeAttr("disabled");
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        })
    }
    $('#order-chart-year').on("change", function () {
        $('#day-money-order-chart').remove();
        $('#day-money-order-chart-div').html("<div id=\"day-money-order-chart\" ></div>");
        var year = $('#order-chart-year').val();
        $.ajax({
            url: "admin/orders/ajax/getMonthOrderedByYear.html",
            method: "GET",
            data: {year: year},
            dataType: 'JSON',
            success: function (response) {
                for (var i = 0, max = 12; i < max; i++) {
                    $("#btn-order-month-" + (i + 1).toString()).attr("disabled", "disabled");
                }
                $.each(response, function (i, item) {
                    $("#btn-order-month-" + item).removeAttr("disabled");
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        })
    });
    /*==============================END NGAN - ORDER============================*/
});
