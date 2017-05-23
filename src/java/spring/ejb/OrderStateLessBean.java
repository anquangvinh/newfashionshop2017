/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package spring.ejb;

import java.io.FileOutputStream;
import java.io.StringReader;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import spring.entity.CartLineInfo;
import spring.entity.Categories;
import spring.entity.DiscountVoucher;
import spring.entity.Orders;
import spring.entity.OrdersDetail;
import spring.entity.Products;
import spring.entity.SizesByColor;
import spring.entity.ProductColors;

/**
 *
 * @author NganNgo
 */
@Stateless
public class OrderStateLessBean implements OrderStateLessBeanLocal {

    @PersistenceContext
    private EntityManager em;

    public EntityManager getEntityManager() {
        return em;
    }

    @Override
    public List<Orders> getAllOrder() {
        try {
            Query q = getEntityManager().createQuery("SELECT o FROM Orders o ORDER BY o.ordersDate DESC", Orders.class);
            return q.getResultList();
        } catch (Exception e) {
            return null;
        }
    }
    
    @Override
    public List<Orders> getAllOrderASC() {
        try {
            Query q = getEntityManager().createQuery("SELECT o FROM Orders o ORDER BY o.ordersDate ASC", Orders.class);
            return q.getResultList();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<Orders> getAllOrderByUserID(int userID) {
        try {
            Query q = getEntityManager().createQuery("SELECT o FROM Orders o WHERE o.user.userID = :userID", Orders.class);
            q.setParameter("userID", userID);
            return q.getResultList();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<OrdersDetail> getAllOrderDetailByOrderID(int orderID) {
        try {
            Query q = getEntityManager().createQuery("SELECT od FROM OrdersDetail od WHERE od.order.ordersID = :orderID", OrdersDetail.class);
            q.setParameter("orderID", orderID);
            return q.getResultList();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Orders getOrderByID(int orderID) {
        try {
            Query q = getEntityManager().createQuery("SELECT o FROM Orders o WHERE o.ordersID = :orderID", Orders.class);
            q.setParameter("orderID", orderID);
            return (Orders) q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public OrdersDetail getOrderDetailByID(int orderDetailID) {
        try {
            Query q = getEntityManager().createQuery("SELECT o FROM OrdersDetail o WHERE o.ordersDetailID = :orderDetailID", OrdersDetail.class);
            q.setParameter("orderDetailID", orderDetailID);
            return (OrdersDetail)q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Products getProductByID(int productID) {
        try {
            Query q = getEntityManager().createQuery("SELECT p FROM Products p WHERE p.productID = :productID", Products.class);
            q.setParameter("productID", productID);
            return (Products) q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<Products> getListProductsByName(String productName) {
        try {
            Query q = getEntityManager().createQuery("SELECT p FROM Products p WHERE p.productName LIKE :productName", Products.class);
            q.setParameter("productName", "%" + productName + "%"); //"%" + productName + "%"
            return q.getResultList();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<ProductColors> getListProductColorsByProductID(int productID) {
        try {
            Query q = getEntityManager().createQuery("SELECT pc FROM ProductColors pc WHERE pc.product.productID = :productID", ProductColors.class);
            q.setParameter("productID", productID);
            return q.getResultList();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<SizesByColor> getListSizesByColorByColorID(int colorID) {
        try {
            Query q = getEntityManager().createQuery("SELECT sbc FROM SizesByColor sbc WHERE sbc.color.colorID = :colorID", SizesByColor.class);
            q.setParameter("colorID", colorID);
            return q.getResultList();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean confirmStatusOrder(Orders orders, short status) {
        try {
            orders.setStatus(status);
            getEntityManager().merge(orders);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    @Override
    public boolean confirmStatusOrderDetail(OrdersDetail ordersDetail, short status) {
        try {
            ordersDetail.setStatus(status);
            getEntityManager().merge(ordersDetail);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    @Override
    public List<Categories> getAllCategory() {
        try {
            Query q = getEntityManager().createQuery("SELECT c FROM Categories c", Categories.class);
            return q.getResultList();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<DiscountVoucher> getAllDiscountVoucher() {
        try {
            Query q = getEntityManager().createQuery("SELECT d FROM DiscountVoucher d", DiscountVoucher.class);
            return q.getResultList();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public DiscountVoucher getDiscountVoucherByID(String discountVoucherID) {
        try {
            Query q = getEntityManager().createQuery("SELECT d FROM DiscountVoucher d WHERE d.voucherID = :discountVoucherID", DiscountVoucher.class);
            q.setParameter("discountVoucherID", discountVoucherID);
            return (DiscountVoucher) q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public int createDiscountVoucher(DiscountVoucher newDiscountVoucher) {
        int checkError = 0;
        DiscountVoucher discountVoucher = getDiscountVoucherByID(newDiscountVoucher.getVoucherID());
        if (discountVoucher != null) {
            checkError = 2;
        } else {
            try {
                getEntityManager().persist(newDiscountVoucher);
                getEntityManager().flush();
                checkError = 1;
            } catch (Exception e) {
                checkError = 0;
            }
        }
        return checkError;
    }

    @Override
    public int updateDiscountVoucher(DiscountVoucher targetDiscountVoucher) {
        int checkError;
        DiscountVoucher oldDiscountVoucher = getDiscountVoucherByID(targetDiscountVoucher.getVoucherID());
        if (oldDiscountVoucher != null) {
            targetDiscountVoucher.setOrdersList(oldDiscountVoucher.getOrdersList());
            try {
                getEntityManager().merge(targetDiscountVoucher);
                checkError = 1;
            } catch (Exception e) {
                checkError = 0;
            }
        } else {
            checkError = 2;
        }
        return checkError;
    }

    @Override
    public SizesByColor getSizesByColorBySizeIDandColorID(int sizeId, int colorId) {
        try {
            Query q = getEntityManager().createQuery("SELECT s FROM SizesByColor s WHERE s.sizeID = :sizeid AND s.color.colorID = :colorid", Categories.class);
            q.setParameter("sizeid", sizeId);
            q.setParameter("colorid", colorId);
            return (SizesByColor) q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public String createPDF(String html) {
        String error = "";
//        try {
////            W3CDom w3CDom = new W3CDom();
////            Document doc = w3CDom.fromJsoup(Jsoup.parse(html));
//            DocumentBuilder db = DocumentBuilderFactory.newInstance().newDocumentBuilder();
//            InputSource is = new InputSource();
//            is.setCharacterStream(new StringReader(html));
//            Document doc = db.parse(is);
////            ITextRenderer renderer = new ITextRenderer();
//////            ResourceLoaderUserAgent callback = new ResourceLoaderUserAgent(renderer.getOutputDevice());
//////            callback.setSharedContext(renderer.getSharedContext());
//////            renderer.getSharedContext().setUserAgentCallback(callback);
////            renderer.setDocument(doc,null);
////            renderer.layout();
//            String fileNameWithPath = "D:\\Download\\fashionshop.pdf";
//            try (FileOutputStream fileOutputStream = new FileOutputStream(fileNameWithPath)) {
////                renderer.createPDF(fileOutputStream);
//                error = doc.toString();
//            } catch (Exception ex) {
//                error = ex.getMessage();
//            }
//        } catch (Exception e) {
//            error = e.getMessage();
//        }
        return error;
    }

    @Override
    public int createOrderDetail(CartLineInfo cartLineInfo, Orders orders) {
        int checkError = 0;
        OrdersDetail ordersDetail = new OrdersDetail();
        ordersDetail.setOrder(orders);
        ordersDetail.setPrice(cartLineInfo.getProduct().getPrice());
        ordersDetail.setProduct(cartLineInfo.getProduct());
        ordersDetail.setProductDiscount(cartLineInfo.getProduct().getProductDiscount());
        ordersDetail.setQuantity(cartLineInfo.getQuantity());
        ordersDetail.setSize(cartLineInfo.getSizesByColor());
        ordersDetail.setStatus(Short.valueOf("2"));
        SizesByColor sizesByColor = cartLineInfo.getSizesByColor();
        sizesByColor.setQuantity(sizesByColor.getQuantity() - cartLineInfo.getQuantity());
        try {
            getEntityManager().persist(ordersDetail);
            getEntityManager().flush();
            getEntityManager().merge(sizesByColor);
            getEntityManager().flush();
            checkError = 1;
        } catch (Exception e) {
            checkError = 0;
        }
        return checkError;
    }

    @Override
    public int deleteDiscountVoucher(DiscountVoucher discountVoucher) {
        if (discountVoucher.getOrdersList().size() != 0) {
            return 2;
        }
        try {
            if (!getEntityManager().contains(discountVoucher)) {
                discountVoucher = getEntityManager().merge(discountVoucher);
            }
            getEntityManager().remove(discountVoucher);
            getEntityManager().flush();
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    
}
