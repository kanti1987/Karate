Feature: Web table validations

  Background:
    Given def webelement = read('classpath:ReadableFiles/webelement.json')
    * driver 'https://www.techlistic.com/2017/02/automate-demo-web-table-with-selenium.html'
#    * driver 'https://www.techlistic.com/p/demo-selenium-practice.html'

  Scenario: Validate Number of rows
    Given waitFor(webelement.Table)
    And def table = text(webelement.Table)
    * def tableRows = locateAll(webelement.rowpath)
    Then print tableRows.length
    Then print table
    Then assert tableRows.length == 7

  Scenario: Validate Cell Data in Web Table
    Given waitFor(webelement.Table)
    When def expectedCellValue = 'Francisco Chang'
    And def actualCellValue = locate(webelement.Celldata).text
    And print actualCellValue
    Then match actualCellValue == expectedCellValue

#  Scenario: Validate Number of Columns
##    Given waitFor(webelement.Table)
##    And def table = text(webelement.Table)
#    Given def tableColumns = locateAll(webelement.columnpath)
#    Then print tableColumns.length
##    Then print table
#    Then assert tableColumns.length == 3

