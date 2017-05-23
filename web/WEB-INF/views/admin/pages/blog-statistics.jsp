<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<style type="text/css">
    #area-chart{
        width: 840px;
        height: 300px;
    }
</style>
<!-- Page Content -->
<div id="page-wrapper">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header"> 
                    <strong>Blogs</strong> 
                    <i class="fa fa-caret-right fa-style" aria-hidden="true" style="color: #337ab7"></i> 
                    <span style="font-size: 0.9em">Monthly view statistics of the blog</span>
                </h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->

        <div class="col-sm-6 text-center">
            <div id="area-chart" >
                <div id="myfirstchart" style="height: 250px">
                    <script type="text/javascript">
                        new Morris.Line({
                            // ID of the element in which to draw the chart.
                            element: 'myfirstchart',
                            // Chart data records -- each entry in this array corresponds to a point on
                            // the chart.
                            data: [
                                {month: '2008', value: 20},
                                {month: '2009', value: 10},
                                {month: '2010', value: 5},
                                {month: '2011', value: 5},
                                {month: '2011', value: 5},
                                {month: '2011', value: 5},
                                {month: '2011', value: 5},
                                {month: '2011', value: 5},
                                {month: '2011', value: 5},
                                {month: '2011', value: 5},
                                {month: '2011', value: 5},
                                {month: '2012', value: 20}
                            ],
                            // The name of the data record attribute that contains x-values.
                            xkey: 'year',
                            // A list of names of data record attributes that contain y-values.
                            ykeys: ['value'],
                            // Labels for the ykeys -- will be displayed when you hover over the
                            // chart.
                            labels: ['Value']
                        });
                    </script>
                </div>
            </div>
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container-fluid -->
</div>
<!-- /#page-wrapper -->
