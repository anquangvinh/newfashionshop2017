<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- BREADCRUMBS -->
<jsp:include page="../blocks/breadcrumbs.jsp" flush="true"/>

<div class="space10"></div>

<!-- MAIN CONTENT -->
<div class="shop-single">
    <div class="container">
        <div class="row">
            <div class="col-md-9 col-sm-8">
                <!-- HTML -->
                <div>
                    <div id="error-checkout">
                        ${error}
                    </div>
                    <input type="hidden" name="emailUser" value="${sessionScope.emailUser}"/>
                    <h4 class="account-title"><span class="fa fa-chevron-right"></span>Checkout Method</h4>
                    <div class="account-form">
                        <form id="checkout-form" method="POST" action="orders/checkout.html">
                            <ul class="form-list row">
                                <li class="col-md-12 col-sm-12" style="padding-bottom: 10px;">
                                    <span style="font-weight: 900; font-size: 16px;">Please choose your address method below</span>
                                </li>
                                <c:forEach items="${userAddressList}" var="userAddress">
                                    <li class="col-md-8 col-sm-6">
                                        <input type="radio" id="diff-address" name="address-chose" value="${userAddress.addressID}"/>
                                        <label style="font-weight: normal;"><span style="font-weight: 700;">Ship to:</span> &nbsp ${userAddress.getUser().firstName} &nbsp ${userAddress.getUser().lastName}<br/>
                                            <span style="font-weight: 700;">Address:</span> ${userAddress.address}<br/>
                                            <span style="font-weight: 700;">Phone:</span> &nbsp ${userAddress.phoneNumber}
                                        </label>
                                    </li>
                                </c:forEach>
                                <li class="col-md-12 col-sm-12">
                                    <input id="diff-address" name="address-chose" value="difference" type="radio" class="input-chkbox"/>
                                    <label style="font-weight: normal;"><span style="font-weight: 700;"> Ship to a different address?</span></label>
                                </li>
                                <li class="col-md-12 col-sm-12 shipping-address">
                                    <ul class="form-list row">
                                        <li class="col-md-8 col-sm-6">
                                            <label>First Name <em>*</em></label>
                                            <p id="error-checkout-firstname" style="color: red; font-weight: 700;"></p>
                                            <input type="text" class="input-text" name="diffFirstname" value=""/>
                                        </li>
                                        <li class="col-md-8 col-sm-6">
                                            <label>Last Name <em>*</em></label>
                                            <p id="error-checkout-lastname" style="color: red; font-weight: 700;"></p>
                                            <input type="text" class="input-text" name="diffLastname" value=""/>
                                        </li>
                                        <li class="col-md-8 col-sm-6">
                                            <label>Phone Number <em>*</em></label>
                                            <p id="error-checkout-phone" style="color: red; font-weight: 700;"></p>
                                            <input type="text" class="input-text" name="diffPhone" value=""/>
                                        </li>
                                        <!--                                        <li class="col-md-6 col-sm-6 form-group">
                                                                                    <label>Province/City</label>
                                                                                    <p id="error-checkout-province" style="color: red;"></p>
                                                                                    <select name="diffProvince">
                                                                                        <option value="">Choose Province/City</option>
                                                                                        <option value="Ho Chi Minh City">Ho Chi Minh City</option>
                                                                                        <option value="Ha Noi">Ha Noi</option>
                                                                                        <option value="Da Nang">Da Nang</option>
                                                                                        <option value="An Giang">An Giang</option>
                                                                                        <option value="Ba Ria - Vung Tau">Ba Ria - Vung Tau</option>
                                                                                        <option value="Bac Giang">Bac Giang</option>
                                                                                        <option value="Bac Kan">Bac Kan</option>
                                                                                        <option value="Bac Lieu">Bac Lieu</option>
                                                                                        <option value="Bac Ninh">Bac Ninh</option>
                                                                                        <option value="Ben Tre">Ben Tre</option>
                                                                                        <option value="Binh Duong">Binh Duong</option>
                                                                                        <option value="Binh Phuoc">Binh Phuoc</option>
                                                                                        <option value="Binh Thuan">Binh Thuan</option>
                                                                                        <option value="Binh Dinh">Binh Dinh</option>
                                                                                        <option value="Ca Mau">Ca Mau</option>
                                                                                        <option value="Can Tho">Can Tho</option>
                                                                                        <option value="Cao Bang">Cao Bang</option>
                                                                                        <option value="Gia Lai">Gia Lai</option>
                                                                                        <option value="Ha Giang">Ha Giang</option>
                                                                                        <option value="Ha Nam">Ha Nam</option>
                                                                                        <option value="Ha Tinh">Ha Tinh</option>
                                                                                        <option value="Hai Duong">Hai Duong</option>
                                                                                        <option value="Hai Phong">Hai Phong</option>
                                                                                        <option value="Hau Giang">Hau Giang</option>
                                                                                        <option value="Hoa Binh">Hoa Binh</option>
                                                                                        <option value="Hung Yen">Hung Yen</option>
                                                                                        <option value="Khanh Hoa">Khanh Hoa</option>
                                                                                        <option value="Kien Giang">Kien Giang</option>
                                                                                        <option value="Kon Tum">Kon Tum</option>
                                                                                        <option value="Lai Chau">Lai Chau</option>
                                                                                        <option value="Lam Dong">Lam Dong</option>
                                                                                        <option value="Lang Son">Lang Son</option>
                                                                                        <option value="Lao Cai">Lao Cai</option>
                                                                                        <option value="Long An">Long An</option>
                                                                                        <option value="Nam Dinh">Nam Dinh</option>
                                                                                        <option value="Nghe An">Nghe An</option>
                                                                                        <option value="Ninh Binh">Ninh Binh</option>
                                                                                        <option value="Ninh Thuan">Ninh Thuan</option>
                                                                                        <option value="Phu Tho">Phu Tho</option>
                                                                                        <option value="Phu Yen">Phu Yen</option>
                                                                                        <option value="Quang Binh">Quang Binh</option>
                                                                                        <option value="Quang Nam">Quang Nam</option>
                                                                                        <option value="Quang Ngai">Quang Ngai</option>
                                                                                        <option value="Quang Ninh">Quang Ninh</option>
                                                                                        <option value="Quang Tri">Quang Tri</option>
                                                                                        <option value="Soc Trang">Soc Trang</option>
                                                                                        <option value="Son La">Son La</option>
                                                                                        <option value="Tay Ninh">Tay Ninh</option>
                                                                                        <option value="Thai Binh">Thai Binh</option>
                                                                                        <option value="Thai Nguyen">Thai Nguyen</option>
                                                                                        <option value="Thanh Hoa">Thanh Hoa</option>
                                                                                        <option value="Thua Thien Hue">Thua Thien Hue</option>
                                                                                        <option value="Tien Giang">Tien Giang</option>
                                                                                        <option value="Tra Vinh">Tra Vinh</option>
                                                                                        <option value="Tuyen Quang">Tuyen Quang</option>
                                                                                        <option value="Vinh Long">Vinh Long</option>
                                                                                        <option value="Vinh Phuc">Vinh Phuc</option>
                                                                                        <option value="Yen Bai">Yen Bai</option>
                                                                                        <option value="Dak Lak">Dak Lak</option>
                                                                                        <option value="Dak Nong">Dak Nong</option>
                                                                                        <option value="Dien Bien">Dien Bien</option>
                                                                                        <option value="Dong Nai">Dong Nai</option>
                                                                                        <option value="Dong Thap">Dong Thap</option>
                                                                                    </select>
                                                                                </li>-->
                                        <li class="col-md-8 col-sm-12">
                                            <label >Address <em>*</em></label>
                                            <p id="error-checkout-address" style="color: red; font-weight: 700;"></p>
                                            <input type="text"  class="input-text" name="diffAddress" value=""/>
                                        </li>
                                        <li class="clearfix"></li>
                                    </ul>
                                </li>
                                <li class="col-md-12 col-sm-12 discount-code">
                                    <ul class="form-list row discount-ul">
                                        <li class="col-md-6 col-sm-6 discount-inputs">
                                            <label><span style="font-weight: 900; font-size: 16px;">Your Discount Code</span></label>
                                            <div class="input-box">
                                                <p class="help-block" id="fs-checkout-discountvou-error" style="color: red;"></p>
                                                <input class="input-text" id="coupon_code" name="coupon_code" value=""/>
                                            </div>
                                        </li>
                                        <li class="col-md-6 col-sm-6 discount-buttons" style="padding-top: 27px;">
                                            <div class="buttons-set">
                                                <button style="height: 40px;" type="button" title="Apply Discount Code" class="btn-black" id="discount-order" ><span><span>Apply Discount Code</span></span></button>
                                            </div>
                                        </li>
                                        <li class="col-md-8 col-sm-6 discount-show">

                                        </li>
                                    </ul>
                                </li>
                                <li class="col-md-12 col-sm-12">
                                    <span style="font-weight: 900; font-size: 16px;">Note (Eg: deliver during office hours)</span>
                                    <p id="error-checkout-note" style="color: red; font-weight: 700;"></p>
                                    <input type="text" class="input-text" name="note"/>
                                </li>
                            </ul>
                            <div class="buttons-set">
                                <input id="btnCheckoutPlaceOrder" class="btn-black" type="submit" value="Place Order"/>
                            </div>
                        </form>
                    </div>
                    <div class="clearfix"></div>   
                </div>
            </div>
            <div class="col-md-3 col-sm-4">
                <div class="side-widget space50">
                    <h3> <span> Your order </span></h3>
                    <div>
                        <table class="cart-table"> 
                            <tbody></tbody>
                            <c:forEach items="${cartList}" var="item">
                                <tr>                                              
                                    <td colspan="2">
                                        <div class="item-img col-md-5 col-sm-5">
                                            <a href="${item.getProduct().productID}-${item.getProduct().productColorList[0].colorID}-${item.getProduct().productNameNA}.html">
                                                <img src="assets/images/products/${item.getProduct().getUrlImg()}" class="img-responsive" alt=""/>
                                            </a>
                                        </div>
                                        <div class="item-info col-md-7 col-sm-7">
                                            <h4>${item.getProduct().productName}</h4>
                                            <p>
                                                &nbsp Size: ${item.getSizesByColor().getProductSize()} 
                                                <img fs-color="${item.getSizesByColor().getColor().colorID}" 
                                                     src="assets/images/products/colors/${item.getSizesByColor().getColor().getUrlColorImg()}" 
                                                     class="img-responsive" 
                                                     alt="${item.getSizesByColor().getColor().urlColorImg}" 
                                                     title="${item.getSizesByColor().getColor().getColor()}"
                                                     style="width: 20px; height: 20px; border: 2px;"/> 
                                            </p>
                                            <p>&nbsp ${item.quantity} &nbsp x $${item.getProduct().getPrice()}</p>
                                        </div>
                                    </td>
                                </tr>
                            </c:forEach>
                            <tfoot class="foot">
                                <tr>
                                    <th>Discount</th>
                                    <td>
                                        <div class="">-$0.0</div>
                                    </td> 
                                </tr>
                                <tr>
                                    <th>Order Total</th>
                                    <td>
                                        <div class="grandTotal">$${grandTotal}</div>
                                    </td> 
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="clearfix space20"></div>
<script type="text/javascript">
    function enterDiscountAgain() {
        $("#discountShow").remove();
        $.get("orders/ajax/nodiscount.html", function (responsenodiscount) {
            $(".foot").html(responsenodiscount);
        });
    };
</script>
