<%@taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!-- BREADCRUMBS -->
<jsp:include page="../blocks/breadcrumbs.jsp" flush="true" />
<script>
  $( function() {
    $( "#birthday" ).datepicker({
        dateFormat: "dd/mm/yy"
    });
  } );
  </script>
  ${status}
<!-- MY ACCOUNT -->
<div class="account-wrap">
    <div class="container">
        <div class="row">
            <div class="col-md-9 col-sm-8">
                <!-- HTML -->
                <div id="account-id">
                    <h4 class="account-title"><span class="fa fa-chevron-right"></span>Create User</h4>                                                                  
                    <div class="account-form">
                        <form:form id="shipping-zip-form" method="post" action="#" modelAttribute="users" enctype="multipart/form-data">                                           
                            <ul class="form-list row">
                                <li class="col-md-4 col-md-6 revicon-info-circled">
                                    <label>Email <em>*</em><label>
                                            <form:input path="email" cssClass="input-text"/>
                                            </li>
                                            <li class="col-md-4 col-sm-5 revicon-info-circled">
                                                <label >Last Name <em>*</em></label>
                                                <form:input path="lastName" cssClass="input-text"/>
                                            </li>

                                            <li class="col-md-4 col-sm-5 revicon-info-circled">
                                                <label >First Name <em>*</em></label>
                                                <form:input path="firstName" cssClass="input-text"/>
                                            </li>
                                            <li class="col-md-4 col-sm-5 revicon-info-circled">
                                                <label >Password <em>*</em></label>
                                                <form:password path="password" cssClass="input-text"/>
                                            </li>

                                            <li class="col-md-4 col-sm-6">
                                                <label>Birth Day</label>
                                                <form:input path="birthday" id="birthday" cssClass="input-text"/>
                                            </li>
                                            <li class="col-md-4 col-sm-6">
                                                <label>Gender</label>
                                                <p><form:radiobutton path="gender" value="1"/>Male</p>
                                                <p><form:radiobutton path="gender" value="0"/>Female</p>
                                            </li>
                                            <li class="col-md-5 col-sm-5 col-sm-push-3 revicon-picture-1">
                                                <label >Avatar</label>
                                                <input type="file" id="upImage" name="upImage" class="input-text">
                                            </li>
                                            </ul>
                                            <div class="buttons-set">
                                                <button class="btn-black revicon-arrows-ccw col-sm-push-3 col-sm-2" type="submit"><span><span>Create</span></span></button>
                                                <button class="btn-black col-sm-push-4 revicon-ccw col-sm-2" type="submit"><span><span>Reset</span></span></button>
                                            </div>
                                        </form:form>
                                        </div>                                
                                        </div>
                                        </div>

                                        <div class="col-md-3 col-sm-4 checkout-steps">
                                            <!-- USER-RIGHT-MENU -->
                                            <jsp:include page="../blocks/user-right-menu.jsp" flush="true" />
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        <div class="clearfix space20"></div>