Feature: Login,Registration,E2E Ecommerce

  Scenario: Login with valid credentials
    Given def data = read('classpath:ReadableFiles/UITest.json')
    Given def webelement = read('classpath:ReadableFiles/webelement.json')
    Given driver data.Scenario1.baseurl +"/practice-test-login"
    And input(webelement.username,data.Scenario1.usernameValid)
    And delay(3000)
    And input(webelement.password,data.Scenario1.password)
    When click(webelement.submit)
    And delay(3000)
    Then match driver.title == 'Logged In Successfully | Practice Test Automation'

  Scenario: Login with invalid credentials
    Given def data = read('classpath:ReadableFiles/UITest.json')
    Given def webelement = read('classpath:ReadableFiles/webelement.json')
    Given driver data.Scenario2.baseurl +"/practice-test-login"
    And delay(3000)
    And input(webelement.username,data.Scenario2.usernameInvalid)
    And delay(3000)
    And input(webelement.password,data.Scenario2.password)
    And delay(3000)
    When click(webelement.submit)
    And delay(3000)
    And def ErrorText = webelement.errortext
    Then print ErrorText
#
  Scenario: Demo Registration
    Given def data = read('classpath:ReadableFiles/UITest.json')
    Given def webelement = read('classpath:ReadableFiles/webelement.json')
    Given driver data.Scenario3.baseurl
    And delay(2000)
    And click(webelement.Registerlink)
    And delay(2000)
    And input(webelement.Firstname,data.Scenario3.Firstname)
    And delay(2000)
    And input(webelement.Lastname,data.Scenario3.Lastname)
    And delay(2000)
    And input(webelement.Email,data.Scenario3.Email)
    And delay(2000)
    And input(webelement.Newpassword,data.Scenario3.Password)
    And input(webelement.Confirmpassword,data.Scenario3.ConfirmPassword)
    And click(webelement.Registerbtn)
    And delay(2000)
    And def SuccessMessage = text(webelement.SuccessfulMessage)
    Then print SuccessMessage

  Scenario: Demo Ecommerce
    Given def data = read('classpath:ReadableFiles/UITest.json')
    Given def webelement = read('classpath:ReadableFiles/webelement.json')
    Given driver data.Scenario4.baseurl
    And delay(3000)
    * driver.maximize()
    And click(webelement.Loginlink)
    And delay(2000)
    And input(webelement.LoginEmail,data.Scenario4.LoginEmail)
    And delay(2000)
    And input(webelement.LoginPassword,data.Scenario4.LoginPassword)
    And click(webelement.Loginbtn)
    And delay(2000)
    * screenshot()
    And click(webelement.ElectronicMenu)
    And delay(2000)
    And click(webelement.Cellphone)
    And delay(2000)
    And click(webelement.Addtocart)
    And delay(2000)
    And click(webelement.Shoppingcartlink)
    And delay(2000)
    * screenshot()
    And click(webelement.AcceptCheckbox)
    * scroll(webelement.Checkout).click()
    And delay(2000)
    And select(webelement.SelectAddress,'{}New Address')
    And delay(2000)
    * screenshot()
    And select(webelement.Country,'{}India')
    And delay(2000)
    And input(webelement.City,data.Scenario4.City)
    And delay(2000)
    And input(webelement.Address,data.Scenario4.Address)
    And delay(2000)
    And input(webelement.Zipcode,data.Scenario4.Zipcode)
    And delay(2000)
    * scroll(webelement.Mobilenumber).input(data.Scenario4.MobileNumber)
    And delay(2000)
    And click(webelement.Continue)
    And delay(2000)
    And select(webelement.SelectAddressdropdown,'{}Saranya S, 26,Nehru Street Bangalore, Bangalore 678543, India')
    And delay(2000)
    And click(webelement.ContinueShippingbuttons)
    And delay(2000)
    And click(webelement.ContinueShippingmethod)
    And delay(2000)
    And click(webelement.Continuepaymentmethod)
    And delay(2000)
    And click(webelement.Continuepaymentinfo)
    And delay(2000)
    * scroll(webelement.Confirmorder).click()
    And delay(2000)
    And def OrderSuccessfulMessage = text(webelement.OrderSuccessfulMessage)
    And print OrderSuccessfulMessage
    And delay(2000)
    And def Orderid = text(webelement.Orderid)
    And delay(2000)
    * screenshot()
    Then print Orderid















