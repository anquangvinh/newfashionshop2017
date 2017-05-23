<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!-- Page Content -->
<div id="page-wrapper">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header"> 
                    <strong>Orders</strong> 
                    <i class="fa fa-caret-right fa-style" aria-hidden="true" style="color: #337ab7"></i> 
                    <span style="font-size: 0.9em">List</span>
                </h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->

        <div class="row">
            <div class="col-lg-12">
                <!--id="dataTables-example"-->
                <table width="100%" class="table table-striped table-bordered table-hover" id="tableOrder">
                    <thead>
                        <tr>
                            <th class="text-center fs-valign-middle">Order ID</th>
                            <th class="text-center fs-valign-middle">First Name</th>
                            <th class="text-center fs-valign-middle">Phone</th>
                            <th class="text-center fs-valign-middle">Address</th>
                            <th class="text-center fs-valign-middle">Date</th>
                            <th class="text-center fs-valign-middle">Status</th>
                            <!--<th>Action</th>-->
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach items="${orderList}" var="order">
                            <tr class="odd gradeX">
                                <td class="text-center fs-valign-middle">
                                    <a href="admin/orders/orderlistdetail/${order.ordersID}.html" style="font-size: 20px; font-weight: 700;">${order.ordersID}</a>
                                </td>
                                <td class="text-center fs-valign-middle">${order.receiverFirstName}</td>
                                <td class="text-center fs-valign-middle">${order.phoneNumber}</td>
                                <td class="text-center fs-valign-middle">${order.deliveryAddress}</td>
                                <td class="text-center fs-valign-middle">
                                    <fmt:formatDate value="${order.ordersDate}" pattern="dd-MM-yyyy hh:mm:ss"/>
                                </td>
                                <td class="text-center fs-valign-middle">
                                    <select name="status-order" id="id-status-order" class="form-control input-sm" 
                                            onchange="window.location = 'admin/orders/confirmstatusOrder/${order.ordersID}/' + this.value + '.html';">
                                        <c:choose>
                                            <c:when test="${order.status == 1}">
                                                <option value="1" <c:out value="selected"/>>Completed</option>
                                                <option value="2">Pending</option>
                                                <option value="3">Confirmed</option>
                                                <option value="0">Canceled</option>
                                            </c:when>
                                            <c:when test="${order.status == 2}">
                                                <option value="1">Completed</option>
                                                <option value="2" <c:out value="selected"/>>Pending</option>
                                                <option value="3">Confirmed</option>
                                                <option value="0">Canceled</option>
                                            </c:when>
                                            <c:when test="${order.status == 3}">
                                                <option value="1">Completed</option>
                                                <option value="2">Pending</option>
                                                <option value="3" <c:out value="selected"/>>Confirmed</option>
                                                <option value="0">Canceled</option>
                                            </c:when>
                                            <c:otherwise>
                                                <option value="1">Completed</option>
                                                <option value="2">Pending</option>
                                                <option value="3">Confirmed</option>
                                                <option value="0"  <c:out value="selected"/>>Canceled</option>
                                            </c:otherwise>
                                        </c:choose>
                                    </select>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
                <!-- /.table-responsive -->
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container-fluid -->
</div>
<!-- /#page-wrapper -->