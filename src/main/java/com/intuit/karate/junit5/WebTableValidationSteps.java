package com.intuit.karate.junit5;

//import org.openqa.selenium.By;
//import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.WebElement;
//
//public class WebTableValidationSteps {
//
//    public static int getRowCount(WebDriver driver) {
//        WebElement table = driver.findElement(By.xpath("//*[@id=/'customers/']"));
//        return table.findElements(By.tagName("tr")).size();
//    }
//
//    public static int getColumnCount(WebDriver driver) {
//        WebElement table = driver.findElement(By.xpath("//*[@id=/'customers/']"));
//        WebElement headerRow = table.findElement(By.tagName("thead")).findElement(By.tagName("tr"));
//        return headerRow.findElements(By.tagName("th")).size();
//    }
//
//    public static String getCellValue(WebDriver driver) {
//        WebElement table = driver.findElement(By.xpath("//*[@id=/'customers/']"));
//        WebElement cell = table.findElement(By.xpath("//td[contains(text(),'John')]"));
//        return cell.getText();
//    }
//
//    public static boolean checkRowExists(WebDriver driver) {
//        WebElement table = driver.findElement(By.xpath("//*[@id=\'customers\']"));
//        return table.findElements(By.xpath("//tr[contains(td/text(),'John')]")).size() > 0;
//    }
//}

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class WebTableValidationSteps {

    private WebDriver driver;

    public WebTableValidationSteps(WebDriver driver) {
        this.driver = driver;
    }

    public int getRowCount() {
        WebElement table = driver.findElement(By.xpath("//table[@id='customers']"));
        return table.findElements(By.tagName("tr")).size();
    }

    public int getColumnCount() {
        WebElement table = driver.findElement(By.xpath("//table[@id='customers']"));
        WebElement headerRow = table.findElement(By.tagName("thead")).findElement(By.tagName("tr"));
        return headerRow.findElements(By.tagName("th")).size();
    }
}
