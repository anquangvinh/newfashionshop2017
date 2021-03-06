<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!-- BREADCRUMBS -->
<jsp:include page="../blocks/breadcrumbs.jsp" flush="true" />

<div class="space10"></div>

<div class="shop-single shopping-cart">
    <div class="container">
        <div class="row">
            <div id="error">
                ${error}
            </div>
            <div class="col-md-12 col-sm-12">
                    <table class="cart-table">
                        <thead>
                            <tr>
                                <th class="text-center">PRODUCT</th>
                                <th class="text-center">DESCRIPTION</th>
                                <th class="text-center">PRICE</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach items="${wishList}" var="wl">
                                <tr id="fs-list-id-${wl.wishID}">
                                    <td class="text-center"><img src="assets/images/products/${wl.product.urlImg}" class="img-responsive" alt=""/></td>
                                    <td class="text-center">
                                        <a href="#"><p><b>Product Name: ${wl.product.productName}</b></p></a>
                                        <p>Cate Name: ${wl.product.category.cateName}</p>
                                        <p>SubCate Name: ${wl.product.subCate.subCateName}</p>
                                    </td>
                                    <td class="text-center" style="text-align: center;">${wl.product.price}</td>
                                    <td class="text-center">
                                        <a class="fs-btn-delete-wl clickable" fs-wl-wlID="${wl.wishID}" ><span style="font-size: 70px;text-align: center;">&times;</span></a>
                                    </td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                <div class="table-btn">
                        <a href="index.html" class="btn-black pull-left">Back Home</a>
                    </div>
                <div class="clearfix space30"></div>
            </div>
        </div>
    </div>
</div>
