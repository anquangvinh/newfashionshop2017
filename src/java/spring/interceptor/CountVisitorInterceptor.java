/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package spring.interceptor;

import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import spring.ejb.ProductStateLessBeanLocal;
import spring.entity.ReturningVisitor;

/**
 *
 * @author vinh.an
 */
public class CountVisitorInterceptor extends HandlerInterceptorAdapter {

    ProductStateLessBeanLocal productStateLessBean = lookupProductStateLessBeanLocal();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();

        if (session.getAttribute("fashionID") == null) {
            Cookie[] cookies = request.getCookies();
            if (cookies == null) { //chưa có bất kì cookie gì cả => tạo mới cookie, thêm mới csdl
                //tạo mới cookie
                String fashionshopID = RequestContextHolder.currentRequestAttributes().getSessionId();
                Cookie ckUserVisit = new Cookie("fashionshopID", fashionshopID);
                ckUserVisit.setMaxAge(365 * 24 * 60 * 60);
                response.addCookie(ckUserVisit);
                session.setAttribute("fashionID", fashionshopID);
                //Them mới vào csdl
                ReturningVisitor newVisitor = new ReturningVisitor();
                newVisitor.setVisitorID(fashionshopID);
                newVisitor.setVisitTimes(1);
                newVisitor.setOnDate(new Date());
                productStateLessBean.createNewVisitor(newVisitor);
            } else { //có cookie từ trang rồi
                int count = 0;
                String fashionID = "";
                for (Cookie c : cookies) {
                    //kiểm tra đã có cookie đếm chưa
                    if (c.getName().equals("fashionshopID")) {
                        count++;
                        fashionID = c.getValue();
                    }
                }

                if (count > 0) {//nếu có cookie để đếm rồi 
                    //=> nếu trong ngày đó chưa có => tạo mới, trong ngày có ID rồi=> update lượt visit lên 1
                    session.setAttribute("fashionID", fashionID);
                    ReturningVisitor visitor = productStateLessBean.getReturningVisitorByIDAndDate(fashionID, new Date());
                    if (visitor != null) { //=> có truy cập trong ngày đó rồi
                        visitor.setVisitTimes(visitor.getVisitTimes() + 1);
                        productStateLessBean.updateVisitTimes(visitor);
                    } else { //=> chưa truy cập trong ngày đó. => thêm mới vào csdl với fashionshopID có sẵn
                        String fashionshopID = fashionID;
                        ReturningVisitor revisitor = new ReturningVisitor();
                        revisitor.setVisitorID(fashionshopID);
                        revisitor.setVisitTimes(1);
                        revisitor.setOnDate(new Date());
                        productStateLessBean.createNewVisitor(revisitor);
                    }
                } else {//nếu chưa cóc cookie đếm => tạo mới cookie. thêm mới vào csdl 
                    //B1:  tạo mới cookie
                    String fashionshopID = RequestContextHolder.currentRequestAttributes().getSessionId();
                    Cookie ckUserVisit = new Cookie("fashionshopID", fashionshopID);
                    ckUserVisit.setMaxAge(365 * 24 * 60 * 60);
                    response.addCookie(ckUserVisit);
                    session.setAttribute("fashionID", fashionshopID);
                    //B2: thêm vào CSDL
                    ReturningVisitor visitor = new ReturningVisitor();
                    visitor.setVisitorID(fashionshopID);
                    visitor.setVisitTimes(1);
                    visitor.setOnDate(new Date());
                    productStateLessBean.createNewVisitor(visitor);
                }
            }
        }
        return true;
    }

    private ProductStateLessBeanLocal lookupProductStateLessBeanLocal() {
        try {
            Context c = new InitialContext();
            return (ProductStateLessBeanLocal) c.lookup("java:global/fashionshop/ProductStateLessBean!spring.ejb.ProductStateLessBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
