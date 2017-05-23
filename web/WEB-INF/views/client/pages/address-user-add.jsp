<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<!-- BREADCRUMBS -->
<jsp:include page="../blocks/breadcrumbs.jsp" flush="true" />

<!-- MY ACCOUNT -->
<div class="account-wrap">
    <div class="container">
        <div class="row">
            <div class="col-sm-8 col-md-9">
                <!-- HTML -->
                <div id="account-id">
                    <h4 class="account-title"><span class="fa fa-chevron-right"></span>Create Address</h4>                                                                  
                    <div class="account-form">
                        <form:form id="shipping-zip-form" action="user/address-add/${findUsersID}.html" method="post" modelAttribute="userAddress">                                        
                            ${error}
                            <ul class="form-list row">
                                <li class="col-md-6 col-sm-6">
                                    <label >Address <em>*</em></label>
                                    <form:input path="address" id="txtaddress"  cssClass="input-text" fs-userID="${findUsersID}"/>
                                    <span></span>
                                </li>
                                <li class="col-md-6 col-sm-6">
                                    <label >Phone Number <em>*</em></label>
                                    <form:input path="phoneNumber" id="txtphone" cssClass="input-text" fs-userID="${findUsersID}" />
                                </li>
                            </ul>
                            <div class="buttons-set">
                                <button class="btn-black" type="submit"><span><span>Create</span></span></button>
                            </div>
                        </form:form>
                    </div>                                    
                </div>
            </div>

            <div class="col-sm-4 col-md-3  checkout-steps">
                <!-- USER-RIGHT-MENU -->
                <jsp:include page="../blocks/user-right-menu.jsp" flush="true" />
            </div>
        </div>
    </div>
</div>
<div class="clearfix space20"></div>
<%-- 
    Document   : address-user-add
    Created on : Apr 9, 2017, 1:36:02 AM
    Author     : hoang
--%>

