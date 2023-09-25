Feature: Login test case
  Background:
    Given def data = read('classpath:ReadableFiles/UITest.json')
    Given def webelement = read('classpath:ReadableFiles/webelement.json')

  Scenario Outline: Login Feature
    Given driver data.SwagLab.baseurl
    And delay(1000)
    And input(webelement.SwagUsername,"<username>")
    And delay(1000)
    And input(webelement.SwagPassword,"<password>")
    And delay(1000)
    And click(webelement.SwagLogin)
    * screenshot()
    Then match driver.url == data.SwagLab.baseurl + 'inventory.html'


    Examples:
    |username               |password|
    |standard_user          |secret_sauce|
    |performance_glitch_user|secret_sauce|
#    |locked_out_user        |secret_sauce|

