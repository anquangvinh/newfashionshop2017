/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package spring.ejb;

import java.util.List;
import java.util.Objects;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import spring.entity.Categories;
import spring.entity.ProductColors;
import spring.entity.ProductRating;
import spring.entity.ProductSubImgs;
import spring.entity.Products;
import spring.entity.SizesByColor;
import spring.entity.SubCategories;

/**
 *
 * @author vinh.an
 */
@Stateless
public class ProductStateLessBean implements ProductStateLessBeanLocal {

    @PersistenceContext
    private EntityManager em;

    public EntityManager getEntityManager() {
        return em;
    }

    /*========================================================================
     *                                                                       *
     *                          CATEGORY TREATMENT                           *
     *                                                                       *
     ========================================================================*/
    @Override
    public List<Categories> categoryList() {
        Query q = getEntityManager().createQuery("SELECT c FROM Categories c", Categories.class);
        return q.getResultList();
    }

    @Override
    public Categories findCategoryByID(int cateID) {
        return getEntityManager().find(Categories.class, cateID);
    }

    @Override
    public Categories findCategoryByName(String cateName) {
        try {
            Query q = getEntityManager().createQuery("SELECT c FROM Categories c WHERE c.cateName LIKE :cateName", Categories.class);
            q.setParameter("cateName", cateName);
            return (Categories) q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<Categories> findCategoryLikeName(String cateName) {
        Query q = getEntityManager().createQuery("SELECT c FROM Categories c WHERE c.cateName LIKE :cateName", Categories.class);
        q.setParameter("cateName", cateName);
        return q.getResultList();
    }

    @Override
    public int createNewCategory(Categories newCate) {
        int errorCode;

        //Kiểm tra trùng tên
        Categories existedCate = findCategoryByName(newCate.getCateName());
        if (existedCate != null) {
            errorCode = 2;  //Tên đã bị TRÙNG
        } else {
            //Insert mới
            try {
                getEntityManager().persist(newCate);
                errorCode = 1;  //Insert thành công 1 dòng
            } catch (Exception e) {
                errorCode = 0;  //Lỗi khi insert, 0 có dòng nào được insert
            }
        }
        return errorCode;
    }

    @Override
    public int updateCategory(Categories targetCate) {
        int errorCode; // = 1; => update thành công, = 0; => update bị lỗi, = 2 => update trùng với tên trước đó.
        Categories oldCate = findCategoryByID(targetCate.getCateID());
        Categories cate = findCategoryByName(targetCate.getCateName());
        if (oldCate.getCateName().equalsIgnoreCase(targetCate.getCateName())) {
            try {
                getEntityManager().merge(targetCate);
                errorCode = 1;
            } catch (Exception e) {
                errorCode = 0;
            }
        } else {
            if (cate != null) {
                errorCode = 2;
            } else {
                try {
                    getEntityManager().merge(targetCate);
                    errorCode = 1;
                } catch (Exception e) {
                    errorCode = 0;
                }
            }

        }
        return errorCode;
    }

    /*=======================================================================
     *                                                                       *
     *                       SUB-CATEGORY TREATMENT                          *
     *                                                                       *
     ========================================================================*/
    @Override
    public List<SubCategories> subCategoryList() {
        Query q = getEntityManager().createQuery("SELECT sc FROM SubCategories sc", SubCategories.class);
        return q.getResultList();
    }

    @Override
    public SubCategories findSubCategoryByID(int subCateID) {
        return getEntityManager().find(SubCategories.class, subCateID);
    }

    @Override
    public int createNewSubCategory(SubCategories newSubCate) {
        int errorCode;

        Query q = getEntityManager().createQuery("SELECT sc FROM SubCategories sc WHERE sc.category.cateID = :cateID AND sc.subCateName LIKE :newSubCateName", SubCategories.class);
        q.setParameter("cateID", newSubCate.getCategory().getCateID());
        q.setParameter("newSubCateName", newSubCate.getSubCateName());

        int count = q.getResultList().size();
        if (count == 1) { //=> đã có SubCategory trong Category đó rồi.
            errorCode = 2;
        } else {//=> Chưa có SubCategory trong Category đó.
            try {
                getEntityManager().persist(newSubCate);
                errorCode = 1;
            } catch (Exception e) {
                errorCode = 0;
            }
        }
        return errorCode;
    }

    @Override
    public int updateSubCategory(SubCategories targetSubCategory) {
        int errorCode;
        SubCategories oldSubCate = getEntityManager().find(SubCategories.class, targetSubCategory.getSubCateID());

        Query q = getEntityManager().createQuery("SELECT sc FROM SubCategories sc WHERE sc.category.cateID = :cateID AND sc.subCateName LIKE :targetSubCateName", SubCategories.class);
        q.setParameter("cateID", targetSubCategory.getCategory().getCateID());
        q.setParameter("targetSubCateName", targetSubCategory.getSubCateName());
        int count = q.getResultList().size();
        if (count == 1) { //=> trùng
            if ((Objects.equals(oldSubCate.getCategory().getCateID(), targetSubCategory.getCategory().getCateID())) && oldSubCate.getSubCateName().equalsIgnoreCase(targetSubCategory.getSubCateName())) {
                try {
                    getEntityManager().merge(targetSubCategory);
                    errorCode = 1; //Update thành công.
                } catch (Exception e) {
                    errorCode = 0; //Update bị lỗi.
                }
            } else {
                errorCode = 2; //bị trùng
            }
        } else { //=> ko bị trùng
            try {
                getEntityManager().merge(targetSubCategory);
                errorCode = 1; //Update thành công.
            } catch (Exception e) {
                errorCode = 0; //Update bị lỗi.
            }
        }
        return errorCode;
    }

    /*========================================================================
     *                                                                       *
     *                          PRODUCT TREATMENT                            *
     *                                                                       *
     ========================================================================*/
    @Override
    public List<Products> productList(String role) {
        Query q;
        if (role.equals("client")) {
            q = getEntityManager().createQuery("SELECT p FROM Products p WHERE p.status = 1 ORDER BY p.productID DESC", Products.class);
        } else {
            q = getEntityManager().createQuery("SELECT p FROM Products p ORDER BY p.productID DESC", Products.class);
        }

        return q.getResultList();
    }

    @Override
    public Products findProductByID(int productID) {
        return getEntityManager().find(Products.class, productID);
    }

    @Override
    public List<Object> getTop3ProductBestSeller() {
        String sql = "SELECT p.productID, p.productName, p.productNameNA, p.price, p.urlImg, sum(od.quantity) as tongsoluong "
                + "FROM OrdersDetail od JOIN od.product p "
                + "WHERE p.status = 1 "
                + "GROUP BY p.productID, p.productName, p.productNameNA, p.price, p.urlImg "
                + "ORDER BY tongsoluong DESC";
        Query q = getEntityManager().createQuery(sql).setMaxResults(3);

        return q.getResultList();
    }

    @Override
    public List<Products> getTop3ProductMostViewed() {
        String sql = "SELECT p FROM Products p WHERE p.status = 1 ORDER BY p.productViews DESC";
        Query q = getEntityManager().createQuery(sql, Products.class).setMaxResults(3);

        return q.getResultList();
    }

    @Override
    public ProductColors findProductColorByColorID(int colorID) {
        ProductColors productColor = getEntityManager().find(ProductColors.class, colorID);
        return productColor;
    }

    @Override
    public boolean checkDuplicateProductName(String name) {
        String sql = "SELECT p FROM Products p WHERE p.productName LIKE :productName";
        Query q = getEntityManager().createQuery(sql, Products.class);
        q.setParameter("productName", name);

        int count = q.getResultList().size();
        return count == 1;
    }

    @Override
    public boolean createNewProduct(Products newProduct) {
        try {
            getEntityManager().persist(newProduct);
            getEntityManager().flush();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void updateProductStatus(int productID, short productStatus) {
        Products targetProduct = findProductByID(productID);

        targetProduct.setStatus(productStatus);
        getEntityManager().merge(targetProduct);
    }

    @Override
    public Float getMaxPriceOfProduct_ByCate(int cateID) {
        String sql = "SELECT MAX(p.price) FROM Products p WHERE p.category.cateID = :cateID";
        Query q = getEntityManager().createQuery(sql, Products.class);
        q.setParameter("cateID", cateID);
        Float price = (Float) q.getResultList().get(0);
        return price;
    }

    @Override
    public Float getMinPriceOfProduct_ByCate(int cateID) {
        String sql = "SELECT MIN(p.price) FROM Products p WHERE p.category.cateID = :cateID";
        Query q = getEntityManager().createQuery(sql, Products.class);
        q.setParameter("cateID", cateID);
        Float price = (Float) q.getResultList().get(0);
        return price;
    }

    @Override
    public List<Object[]> productsByFilter_OfACategory(int cateID, float fromPrice, float toPrice, String filterColor, String filterSize) {
        String sql = "SELECT DISTINCT"
                + "         p.productID, p.price\n"
                + "FROM Products p\n"
                + "JOIN p.productColorList pc\n"
                + "JOIN pc.sizeList ps\n"
                + "WHERE p.category.cateID = :cateID "
                + "AND (p.price BETWEEN :fromPrice AND :toPrice) "
                + filterColor
                + filterSize
                + "AND p.status = 1";
        Query q = getEntityManager().createQuery(sql, Products.class);
        q.setParameter("cateID", cateID);
        q.setParameter("fromPrice", fromPrice);
        q.setParameter("toPrice", toPrice);

        return q.getResultList();
    }

    @Override
    public List<Object[]> filterProductByCategory(int cateID, int page, int itemPerPage,
            float fromPrice, float toPrice,
            String filterColor, String filterSize, int sortBy) {
        String sql;
        if (sortBy == 1) {//1: Newest; 2: Low to High Price; 3: High to Low Price
            sql = "SELECT DISTINCT"
                    + "         p.productID, p.price\n"
                    + "FROM Products p\n"
                    + "JOIN p.productColorList pc\n"
                    + "JOIN pc.sizeList ps\n"
                    + "WHERE p.category.cateID = :cateID "
                    + "AND (p.price BETWEEN :fromPrice AND :toPrice) "
                    + filterColor
                    + filterSize
                    + "AND p.status = 1 ORDER BY p.productID DESC";
        } else if (sortBy == 2) {
            sql = "SELECT DISTINCT"
                    + "         p.productID, p.price\n"
                    + "FROM Products p\n"
                    + "JOIN p.productColorList pc\n"
                    + "JOIN pc.sizeList ps\n"
                    + "WHERE p.category.cateID = :cateID "
                    + "AND (p.price BETWEEN :fromPrice AND :toPrice) "
                    + filterColor
                    + filterSize
                    + "AND p.status = 1 ORDER BY p.price ASC";
        } else {
            sql = "SELECT DISTINCT"
                    + "         p.productID, p.price\n"
                    + "FROM Products p\n"
                    + "JOIN p.productColorList pc\n"
                    + "JOIN pc.sizeList ps\n"
                    + "WHERE p.category.cateID = :cateID "
                    + "AND (p.price BETWEEN :fromPrice AND :toPrice) "
                    + filterColor
                    + filterSize
                    + "AND p.status = 1 ORDER BY p.price DESC";
        }
        int firstResult = (page - 1) * itemPerPage;
        Query q = getEntityManager().createQuery(sql);
        q.setParameter("cateID", cateID);
        q.setParameter("fromPrice", fromPrice);
        q.setParameter("toPrice", toPrice);
        q.setFirstResult(firstResult);
        q.setMaxResults(itemPerPage);
        return q.getResultList();
    }

    @Override
    public Float getMaxPriceOfProduct_BySubCate(int subCateID) {
        String sql = "SELECT MAX(p.price) FROM Products p WHERE p.subCate.subCateID = :subCateID";
        Query q = getEntityManager().createQuery(sql, Products.class);
        q.setParameter("subCateID", subCateID);
        Float price = (Float) q.getResultList().get(0);
        return price;
    }

    @Override
    public Float getMinPriceOfProduct_BySubCate(int subCateID) {
        String sql = "SELECT MIN(p.price) FROM Products p WHERE p.subCate.subCateID = :subCateID";
        Query q = getEntityManager().createQuery(sql, Products.class);
        q.setParameter("subCateID", subCateID);
        Float price = (Float) q.getResultList().get(0);
        return price;
    }

    @Override
    public List<Object[]> filterProductBySubCategory(int subCateID, int page, int itemPerPage,
            float fromPrice, float toPrice,
            String filterColor, String filterSize, int sortBy) {
        String sql;
        if (sortBy == 1) {//1: Newest; 2: Low to High Price; 3: High to Low Price
            sql = "SELECT DISTINCT"
                    + "         p.productID, p.price\n"
                    + "FROM Products p\n"
                    + "JOIN p.productColorList pc\n"
                    + "JOIN pc.sizeList ps\n"
                    + "WHERE p.subCate.subCateID = :subCateID "
                    + "AND (p.price BETWEEN :fromPrice AND :toPrice) "
                    + filterColor
                    + filterSize
                    + "AND p.status = 1 ORDER BY p.productID DESC";
        } else if (sortBy == 2) {
            sql = "SELECT DISTINCT"
                    + "         p.productID, p.price\n"
                    + "FROM Products p\n"
                    + "JOIN p.productColorList pc\n"
                    + "JOIN pc.sizeList ps\n"
                    + "WHERE p.subCate.subCateID = :subCateID "
                    + "AND (p.price BETWEEN :fromPrice AND :toPrice) "
                    + filterColor
                    + filterSize
                    + "AND p.status = 1 ORDER BY p.price ASC";
        } else {
            sql = "SELECT DISTINCT"
                    + "         p.productID, p.price\n"
                    + "FROM Products p\n"
                    + "JOIN p.productColorList pc\n"
                    + "JOIN pc.sizeList ps\n"
                    + "WHERE p.subCate.subCateID = :subCateID "
                    + "AND (p.price BETWEEN :fromPrice AND :toPrice) "
                    + filterColor
                    + filterSize
                    + "AND p.status = 1 ORDER BY p.price DESC";
        }
        int firstResult = (page - 1) * itemPerPage;
        Query q = getEntityManager().createQuery(sql);
        q.setParameter("subCateID", subCateID);
        q.setParameter("fromPrice", fromPrice);
        q.setParameter("toPrice", toPrice);
        q.setFirstResult(firstResult);
        q.setMaxResults(itemPerPage);
        return q.getResultList();
    }

    @Override
    public List<Object[]> productsByFilter_OfASubCategory(int subCateID, float fromPrice, float toPrice, String filterColor, String filterSize) {
        String sql = "SELECT DISTINCT"
                + "         p.productID, p.price\n"
                + "FROM Products p\n"
                + "JOIN p.productColorList pc\n"
                + "JOIN pc.sizeList ps\n"
                + "WHERE p.subCate.subCateID = :subCateID "
                + "AND (p.price BETWEEN :fromPrice AND :toPrice) "
                + filterColor
                + filterSize
                + "AND p.status = 1";
        Query q = getEntityManager().createQuery(sql, Products.class);
        q.setParameter("subCateID", subCateID);
        q.setParameter("fromPrice", fromPrice);
        q.setParameter("toPrice", toPrice);

        return q.getResultList();
    }

    @Override
    public boolean updateProductGeneralInfo(Products targetProduct) {
        try {
            getEntityManager().merge(targetProduct);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean updateProductColorStatus(int colorID, short newStt) {
        ProductColors targetColor = getEntityManager().find(ProductColors.class, colorID);

        targetColor.setStatus(newStt);

        try {
            getEntityManager().merge(targetColor);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public ProductColors getProductColorByID(int colorID) {
        return getEntityManager().find(ProductColors.class, colorID);
    }

    @Override
    public boolean updateProductColor(ProductColors targetColor) {
        try {
            getEntityManager().merge(targetColor);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public ProductSubImgs getProductSubImgByID(int subImgID) {
        return getEntityManager().find(ProductSubImgs.class, subImgID);
    }

    @Override
    public boolean updateProductSubImg(ProductSubImgs targetSubImg) {
        try {
            getEntityManager().merge(targetSubImg);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public int deleteProductSubImg(int targetSubImgID) {
        try {
            ProductSubImgs targetSubImg = getEntityManager().find(ProductSubImgs.class, targetSubImgID);
            if (targetSubImg != null) {
                ProductColors parentColor = targetSubImg.getProductColor();
                parentColor.getProductSubImgsList().remove(targetSubImg);
                getEntityManager().remove(targetSubImg);
                getEntityManager().flush();
                return 0;
            }
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 2;
        }
    }
    
    @Override
    public SizesByColor getSizeByID(int sizeID){
        return getEntityManager().find(SizesByColor.class, sizeID);
    }

    @Override
    public boolean updateSize(SizesByColor targetSize) {
        try {
            getEntityManager().merge(targetSize);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public int deleteProductSize(int sizeID) {
        try {
            SizesByColor targetSize = getEntityManager().find(SizesByColor.class, sizeID);
            if (targetSize != null) {
                ProductColors parentColor = targetSize.getColor();
                parentColor.getSizeList().remove(targetSize);
                getEntityManager().remove(targetSize);
                getEntityManager().flush();
                return 0;
            }
            return 1; //Không tìm thấy size
        } catch (Exception e) {
            e.printStackTrace();
            return 2; //Loi trong khi xóa
        }
    }

    @Override
    public boolean createNewProductRating(int productID, ProductRating newProductRating) {
        Products targetProduct = findProductByID(productID);
        targetProduct.getProductRatingList().add(newProductRating);
        try {
            getEntityManager().persist(newProductRating);
            getEntityManager().merge(newProductRating);
            getEntityManager().flush();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
