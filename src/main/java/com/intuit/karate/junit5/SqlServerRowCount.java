package com.intuit.karate.junit5;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SqlServerRowCount {
    private static Connection connection;

    public static void setupDatabaseConnection(String server, String port, String database, String username, String password) throws Exception {
        String jdbcUrl = "jdbc:sqlserver://" + server + ":" + port + ";databaseName=" + database + ";encrypt=false;";
//        String jdbcUrl = "jdbc:sqlserver://localhost:1433;databaseName=test_database;encrypt=false;trustServerCertificate=false";

        connection = DriverManager.getConnection(jdbcUrl, username, password);
    }

    public static int executeRowCountQuery(String tableName) throws Exception {
        String sqlQuery = "SELECT COUNT(*) FROM " + tableName;
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(sqlQuery);

        int rowCount = -1;
        while (resultSet.next()) {
            rowCount = resultSet.getInt(1);
        }

        resultSet.close();
        statement.close();

        return rowCount;
    }

    public static void closeDatabaseConnection() throws Exception {
        if (connection != null) {
            connection.close();
        }
    }
    public static boolean checkDataExistence(String tableName, String columnName, String searchValue) throws SQLException {
        String sqlQuery = "SELECT * FROM " + tableName + " WHERE " + columnName + " = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
        preparedStatement.setString(1, searchValue);
        ResultSet resultSet = preparedStatement.executeQuery();

        boolean dataExists = resultSet.next(); // Check if there are rows in the result set

        resultSet.close();
        preparedStatement.close();

        return dataExists;
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
