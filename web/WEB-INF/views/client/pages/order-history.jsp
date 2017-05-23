<%-- 
    Document   : order-history
    Created on : Feb 28, 2017, 5:05:55 PM
    Author     : vinh.an
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<!-- BREADCRUMBS -->
<jsp:include page="../blocks/breadcrumbs.jsp" flush="true" />

<!-- MY ACCOUNT -->
<div class="account-wrap">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <!-- HTML -->
                <div id="account-id">
                    <h4 class="account-title"><span class="fa fa-chevron-right"></span>Your Order History</h4>                                                                    
                    <div class="order-history">
                        <table class="cart-table table-hover" id="table-order-history">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product(s)</th>
                                    <th>Total</th>
                                    <th>Order Date</th>
                                    <th>Status</th>
                                    <!--<th></th>-->
                                </tr>
                            </thead>
                            <tbody>
                                <c:forEach items="${orderList}" var="order">
                                    <tr>
                                        <td align="center"><a href="orders/order-history-detail/${order.ordersID}.html">Order No.${order.ordersID}</a></td>
                                        <td align="center">
                                            <c:choose>
                                                <c:when test="${order.getOrderDetailForOrderHistoryPage() != null}">
                                                    ${order.getOrderDetailForOrderHistoryPage().product.productName}
                                                    &nbsp - &nbsp ${order.getOrderDetailForOrderHistoryPage().size.color.color}
                                                    &nbsp - &nbsp Size: &nbsp ${order.getOrderDetailForOrderHistoryPage().size.productSize}
                                                </c:when>
                                                <c:otherwise><span style="font-weight: 700px;">Your order is empty</span></c:otherwise>
                                            </c:choose>
                                        </td>
                                        <td style="width: 100px;">
                                            <div class="item-price">$${order.getPaymentTotal()}</div>
                                        </td>
                                        <td align="center">
                                            <fmt:formatDate value="${order.ordersDate}" pattern="dd-MM-yyyy hh:mm:ss"/>
                                        </td>
                                        <td>
                                            <c:choose>
                                                <c:when test="${order.status == 1}">Completed</c:when>
                                                <c:when test="${order.status == 2}">Pending</c:when>
                                                <c:when test="${order.status == 3}">Confirmed</c:when>
                                                <c:otherwise>Canceled</c:otherwise>
                                            </c:choose>
                                        </td>
                                    </tr> 
                                </c:forEach>
                            </tbody>
                        </table>

                        <div class="table-btn">
                            <a href="user/myaccount.html" class="btn-black">Back To Account</a>
                        </div>
                    </div>                          
                </div>
            </div>
        </div>
    </div>
</div>
<div class="clearfix space20"></div>