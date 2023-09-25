Feature: number conversion
  Background:
    * def config = karate.read('classpath:AssertionsConfig.json')
    * configure headers = config.headersXML

  Scenario: convert a number to words
    When url 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso'
    And def numberConversionPayload = read('classpath:ReadableFiles/numberConversion.xml')
    And request numberConversionPayload
    When method post
    Then status 200
    Then match /Envelope/Body/NumberToWordsResponse/NumberToWordsResult == config.expectedWord
      # Logging
    And print 'Post Response:', response

  Scenario: List of Countries by Name
    When url  'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso'
    And  def listofcountriesPayload = read('classpath:ReadableFiles/CaptialCity.xml')
    And  request listofcountriesPayload
    When method post
    Then status 200
    Then match /Envelope/Body/CapitalCityResponse/CapitalCityResult == config.expectedWord2
      # Logging
    And print 'Post Response:', response
