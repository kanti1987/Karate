package com.intuit.karate.junit5;

//4th Connection


//import java.sql.Connection;
//
//import java.sql.DriverManager;
//
//import java.sql.ResultSet;
//
//import java.sql.SQLException;
//
//import java.sql.Statement;
//
//
//
//public class DatabaseConnectionUtil {
//
//    private static Connection connection;
//
//
//
//    public static Connection connectToDatabase() {
//
//        if (connection == null) {
//
//            try {
//
//                String url = "jdbc:sqlserver://localhost:1433;databaseName=test_database;encrypt=false;trustServerCertificate=false";
//
//                String user = "sa";
//
//                String password = "Saranya@21";
//
//                connection = DriverManager.getConnection(url, user, password);
//
//            } catch (SQLException e) {
//
//                e.printStackTrace();
//
//            }
//
//        }
//
//        return connection;
//
//    }
//
//
//
//    public static ResultSet executeQuery(String sqlQuery) {
//
//        try {
//
//            Statement statement = connection.createStatement();
//
//            return statement.executeQuery(sqlQuery);
//
//        } catch (SQLException e) {
//
//            e.printStackTrace();
//
//            return null;
//
//        }
//
//    }
//
//
//
//    public static void closeConnection() {
//
//        if (connection != null) {
//
//            try {
//
//                connection.close();
//
//            } catch (SQLException e) {
//
//                e.printStackTrace();
//
//            }
//
//        }
//
//    }
//
//}


//2nd code
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class DatabaseConnectionUtil {
    // ... other methods ...
    private static Connection connection;



    public static Connection connectToDatabase() {

        if (connection == null) {

            try {

                String url = "jdbc:sqlserver://localhost:1433;databaseName=test_database;encrypt=false;trustServerCertificate=false";

                String user = "sa";

                String password = "Saranya@21";

                connection = DriverManager.getConnection(url, user, password);

            } catch (SQLException e) {

                e.printStackTrace();

            }

        }

        return connection;

    }
    public static List<String> executeQueryAndReturnList(String sqlQuery) {
        List<String> resultList = new ArrayList<>();
        try {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(sqlQuery);
            while (resultSet.next()) {
                resultList.add(resultSet.getString("price")); // Replace "product_name" with the actual column name
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return resultList;
    }
}
