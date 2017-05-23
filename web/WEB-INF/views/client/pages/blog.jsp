<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!-- BREADCRUMBS -->
<jsp:include page="../blocks/breadcrumbs.jsp" flush="true" />
<div class="space10"></div>
<!-- BLOG CONTENT -->
<div class="blog-content">
    <div class="container">
        <div class="row">
            <!-- Sidebar -->
            <aside class="col-md-3 col-sm-4">
                <div class="side-widget space50">
                    <h3><span>Search</span></h3>
                    <form role="form" class="search-widget" method="POST" action="blog-categories.html">
                        <input class="form-control" type="text" name="searchBlog"/>
                        <button type="submit"><i class="fa fa-search"></i></button>
                    </form>
                </div>
                <!--                <div class="side-widget space50">
                                    <h3><span>Category</span></h3>
                                    <table>
                <c:forEach items="${blogCateListClient}" var="blogcateclient">
                    <tr>
                        <td blog-cate-id="${blogcateclient.blogCateID}" onclick="">${blogcateclient.blogCateName}</td>
                    </tr>
                </c:forEach>
            </table>

        </div>-->
                <div class="side-widget space50">
                    <h3><span>Month</span></h3>
                    <select id="monthblog" class="form-control">
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>

                </div>
                <div class="side-widget space50">
                    <h3><span>Popular Post</span></h3>
                    <ul class="list-unstyled popular-post">
                        <c:forEach items="${PopularPosts}" var="blogpopularclient" begin="0" end="2" varStatus="no">
                            <li>
                                <div class="popular-img">
                                    <a href="blog-detail/${blogpopularclient.blogID}.html"> <img src="assets/images/blog/1/${blogpopularclient.blogImg}" class="img-responsive" alt=""></a>
                                </div>
                                <div class="popular-desc">
                                    <h5> <a href="blog-detail/${blogpopularclient.blogID}.html">${blogpopularclient.blogTitle}</a></h5>
                                    <span>By ${blogpopularclient.user.lastName} ${blogpopularclient.user.firstName}</span>
                                </div>
                            </li>
                        </c:forEach>
                    </ul>
                </div>
            </aside>
            <div class="col-md-9 col-sm-8 blog-content">
                <!--                <article class="blogpost">
                                    <div class="space30"></div>
                                     Media Gallery 
                                    <div class="post-media">
                                        <div class="blog-slider">
                                            <div class="item">						
                                                <img src="" class="img-responsive" alt="">
                                                <img src="assets/images/blog/1/1097x600.jpeg" class="img-responsive" alt=""/>
                                            </div>
                                            <div class="item">						
                                                <img src="assets/images/blog/1/1097x600a.jpeg" class="img-responsive" alt=""/>
                                            </div>
                                            <div class="item">						
                                                <img src="assets/images/blog/1/1097x600c.jpeg" class="img-responsive" alt=""/>
                                            </div>
                                        </div>
                                    </div>
                                </article>-->
                <!--<div class="blog-content-list" style="display: flex;">-->
                <!--                <div id="myCarousel" class="carousel slide" data-ride="carousel">
                                     Indicators 
                                    <ol class="carousel-indicators">
                                        <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                                        <li data-target="#myCarousel" data-slide-to="1"></li>
                                        <li data-target="#myCarousel" data-slide-to="2"></li>
                                    </ol>
                                    <div class="space30">
                                         Wrapper for slides 
                                        <div id="myCarousel" class="carousel slide" data-ride="carousel">
                                            <div class="carousel-inner">
                                                <div class="item active">
                                                    <img src="assets/images/blog/1/1097x600.jpeg" class="img-responsive" alt=""/>
                                                </div>
                                                <div class="item">
                                                    <img src="assets/images/blog/1/1097x600a.jpeg" class="img-responsive" alt=""/>
                                                </div>
                
                                                <div class="item">
                                                    <img src="assets/images/blog/1/1097x600c.jpeg" class="img-responsive" alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                
                                     Left and right controls 
                                    <a class="left carousel-control" href="#myCarousel" data-slide="prev">
                                        <span class="glyphicon glyphicon-chevron-left"></span>
                                        <span class="sr-only">Previous</span>
                                    </a>
                                    <a class="right carousel-control" href="#myCarousel" data-slide="next">
                                        <span class="glyphicon glyphicon-chevron-right"></span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </div>
                                <br>-->
                <div class="image-gallery-list">
                    <ul class="image-gallery-ul">
                        <c:forEach items="${blogListIndex}" var="blogclient" begin="0" end="1000" varStatus="no">
                            <li>
                                <div class="col-md-12 col-sm-8 blog-content">
                                    <article class="blogpost" >
                                        <blockquote class="style2">
                                            <span class="icon-quote"></span>
                                            <div class="quote-one-right">
                                                <p>${blogclient.blogTitle}</p>
                                            </div>
                                        </blockquote>
                                        <div class="quote-meta">
                                            <div class="post-meta">
                                                <span><i class="fa fa-calendar"></i>&nbsp;${blogclient.postedDate}</span>
                                                <span><i class="fa fa-user"></i>&nbsp;${blogclient.user.lastName} ${blogclient.user.firstName}</span>
                                                <span><i class="fa fa-folder"></i><a href="blog-categories/${blogclient.blogCategory.blogCateID}.html">&nbsp;${blogclient.blogCategory.blogCateName}</a></span>
                                                <span><i class="fa fa-eye"></i>&nbsp; ${blogclient.blogViews}</span>
                                            </div>
                                            <div class="space20"></div>
                                            <div class="post-media">
                                                <img src="assets/images/blog/1/${blogclient.blogImg}" class="lazy img-responsive" alt="">
                                            </div>
                                            <div class="post-excerpt">
                                                <p>${blogclient.blogSummary}</p>
                                            </div>
                                            <a href="blog-detail/${blogclient.blogID}.html" class="btn-black">Read More&nbsp;&nbsp;<i class="fa fa-angle-right"></i></a>
                                        </div>
                                    </article>
                                    <div class="blog-sep"></div>
                                </div>
                            </li>
                        </c:forEach>
                    </ul>
                </div>
                <!--</div>-->
                <!--                Button Load More-->

                <!-- End Content -->
            </div>
        </div>
    </div>
</div>
<div class="clearfix space20"></div>
<!--<script type="text/javascript">
    var mincount = 5;
    var maxcount = 10;
    $("#bloglist li").slice(5).hide();
    $("#bloglistdiv").scroll(function () {
        if ($("#bloglistdiv").scrollTop() + $("#bloglistdiv").height() >= $("#bloglistdiv")[0].scrollHeight) {
            $("#bloglist li").slice(mincount, maxcount).fadeIn(1200);

//            $("#loading").fadeIn(100).delay(1000).fadeOut(100);

            mincount = mincount + 5;
            maxcount = maxcount + 5;

        }
    });
</script>-->

