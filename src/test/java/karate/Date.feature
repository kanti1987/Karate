Feature: Date selection

  Background:
    Given def data = read('classpath:ReadableFiles/UITest.json')
    Given def webelement = read('classpath:ReadableFiles/webelement.json')
    * def testdata = data.DatePicker

  Scenario: Simple date picker
    Given driver testdata.baseurl1
    And delay(5000)
    And input(webelement.Datepicker1,testdata.Datepicker)
    And delay(2000)


  Scenario: Alerts TC
    Given driver 'https://demo.automationtesting.in/Alerts.html'
    * driver.maximize()
    And delay(1000)
    * screenshot()
    And click(webelement.Alertwithok)
    And delay(1000)
    * screenshot()
    And click(webelement.ClickAlert)
    * screenshot()
    * dialog(true)
    And delay(1000)
    And click(webelement.AlertWithOkCancel)
    And delay(1000)
    And click(webelement.ClickAlertWithOkCancel)
    * screenshot()
    And delay(1000)
    * dialog(false)
    And def actualText = text(webelement.ConfirmText)
    And match actualText == 'You Pressed Cancel'
    And print actualText
    And click(webelement.AlertWithTextbox)
    And delay(1000)
    And click(webelement.ClickAlertWithTextbox)
    * screenshot()
    * dialog(true,'Alert Text box')
    * screenshot()
    And def actualText1 = text(webelement.ConfirmText1)
    And match actualText1 == 'Hello Alert Text box How are you today'
    And print actualText1

   Scenario: Switching Tab
    Given driver 'https://www.hyrtutorials.com/p/window-handles-practice.html'
    And click(webelement.NewTab)
    And delay(3000)
    * switchPage('Window Handles Practice - H Y R Tutorials')
     And delay(3000)
     * screenshot()

#  Scenario: Iframe example
#    Given driver 'https://nxtgenaiacademy.com/iframe/'
#    And delay(2000)
#    * switchFrame("//iframe[@name='iframe_a']")
#    And input(webelement.FName,testdata.FName)
#    And delay(1000)
#    And input(webelement.LName,testdata.LName)
#    And delay(1000)
#    And click(webelement.Gender)
#    And input(webelement.Address1,testdata.Address1)
#    And input(webelement.Street,testdata.Street)
#    And input(webelement.City1,testdata.City1)
##    And select(webelement.Country1,'testdata.{}India')
#    And input(webelement.Email1,testdata.Email1)
#    And delay(2000)
##    And input(webelement.Date1),testdata.Date1)
##    And select(webelement.Hour,'testdata.{}09')
##    And select(webelement.Minute,'testdata.{}10')
#    And input(webelement.MobileNumber,testdata.Mobilenumber)
#    And delay(2000)
#    And click(webelement.UFT)
#    And delay(2000)
#    And input(webelement.VerificationNumber,'99')
#    And delay(2000)
#    And click(webelement.Submit)
#    And delay(2000)
#    And def SuccessfulMessage = text(webelement.SubmittedMessage)
#    And print SuccessfulMessage
#
#   Scenario: Iframe within an iframe -Not working
#     Given driver 'https://chercher.tech/practice/frames'
#    And delay(2000)
#    * switchFrame("//iframe[@id='frame1']")
#     And delay(2000)
#     And input(webelement.Text,testdata.Text)
#     * screenshot()
#     * switchFrame("//iframe[@id='frame3']")
#     And click(webelement.Checkbox)
#     And delay(2000)
#     * screenshot()
#     * switchFrame(1)
##     * switchFrame("//iframe[@id='frame2']")
##     And select(webelement.AnimalDropdown,'{}Baby Cat')
#     * mouse(webelement.AnimalDropdown).click()
#     * mouse(webelement.Babycat).click()
#     And delay(2000)
#     * screenshot()







