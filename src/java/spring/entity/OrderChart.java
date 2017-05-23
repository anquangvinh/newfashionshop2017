/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package spring.entity;

/**
 *
 * @author NganNgo
 */
public class OrderChart {
    private String category;
    private float paymentTotal;

    public OrderChart() {
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public float getPaymentTotal() {
        return paymentTotal;
    }

    public void setPaymentTotal(float paymentTotal) {
        this.paymentTotal = paymentTotal;
    }
    
    
}
