/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package spring.ejb;

import java.util.List;
import javax.ejb.Local;
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
@Local
public interface ProductStateLessBeanLocal {
    /*========================================================================
     *                                                                       *
     *                          CATEGORY TREATMENT                           *
     *                                                                       *
     ========================================================================*/

    List<Categories> categoryList();

    Categories findCategoryByID(int cateID);

    Categories findCategoryByName(String cateName);

    List<Categories> findCategoryLikeName(String cateName);

    int createNewCategory(Categories newCate);

    int updateCategory(Categories targetCate);

    /*========================================================================
     *                                                                       *
     *                       SUB-CATEGORY TREATMENT                          *
     *                                                                       *
     ========================================================================*/
    List<SubCategories> subCategoryList();

    SubCategories findSubCategoryByID(int subCateID);

    int createNewSubCategory(SubCategories newSubCate);

    int updateSubCategory(SubCategories targetSubCategory);

    /*========================================================================
     *                                                                       *
     *                          PRODUCT TREATMENT                            *
     *                                                                       *
     ========================================================================*/
    List<Products> productList(String role);

    Products findProductByID(int productID);

    List<Object> getTop3ProductBestSeller();

    List<Products> getTop3ProductMostViewed();

    ProductColors findProductColorByColorID(int colorID);

    boolean checkDuplicateProductName(String name);

    boolean createNewProduct(Products newProduct);

    void updateProductStatus(int productID, short productStatus);

    Float getMaxPriceOfProduct_ByCate(int cateID);

    Float getMinPriceOfProduct_ByCate(int cateID);

    List<Object[]> productsByFilter_OfACategory(int cateID, float fromPrice, float toPrice, String filterColor, String filterSize);

    List<Object[]> filterProductByCategory(int cateID, int page, int itemPerPage, float fromPrice, float toPrice, String filterColor, String filterSize, int sortBy);

    Float getMaxPriceOfProduct_BySubCate(int subCateID);

    Float getMinPriceOfProduct_BySubCate(int subCateID);

    List<Object[]> filterProductBySubCategory(int subCateID, int page, int itemPerPage, float fromPrice, float toPrice, String filterColor, String filterSize, int sortBy);

    List<Object[]> productsByFilter_OfASubCategory(int subCateID, float fromPrice, float toPrice, String filterColor, String filterSize);
    
    boolean updateProductGeneralInfo (Products targetProduct);
    
    boolean updateProductColorStatus(int colorID, short newStt);
    
    ProductColors getProductColorByID(int colorID);
    
    boolean updateProductColor(ProductColors targetColor);
    
    ProductSubImgs getProductSubImgByID(int subImgID);
    
    boolean updateProductSubImg (ProductSubImgs targetSubImg);
    
    int deleteProductSubImg (int targetSubImgID);
    
    SizesByColor getSizeByID(int sizeID);
    
    boolean updateSize (SizesByColor targetSize);
    
    int deleteProductSize(int sizeID);
    
    boolean createNewProductRating(int productID, ProductRating newProductRating);
}
