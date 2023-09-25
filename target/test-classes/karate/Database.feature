
Feature: Database Validations

  Background:
    * def SqlServerRowCount = Java.type('com.intuit.karate.junit5.SqlServerRowCount')
    Given SqlServerRowCount.setupDatabaseConnection('localhost', '1433', 'test_database', 'sa', '!@Snithi1987')


  Scenario: Execute a Database Query
    Given def query = 'SELECT * FROM [test_database].[dbo].[products]'
    * def resultList = SqlServerRowCount.executeQueryAndReturnList(query)
    * print resultList
    And SqlServerRowCount.closeDatabaseConnection()

  Scenario Outline: Count the number of rows in a SQL Server table
    When def actualRowCount = SqlServerRowCount.executeRowCountQuery('[test_database].[dbo].[products]')
    Then match actualRowCount.toString() == expectedRowCount
    And SqlServerRowCount.closeDatabaseConnection()

    Examples:
      | expectedRowCount |
      | 5                |

  Scenario: To check whether specific data is present in a table
    Given def dataExists = SqlServerRowCount.checkDataExistence('[test_database].[dbo].[products]', 'product_name', 'Laptop')
    Then print 'Data exists in the table:', dataExists
    Then match dataExists == true
    And SqlServerRowCount.closeDatabaseConnection()

