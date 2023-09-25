Feature: API Data driven Testing
  Background:
    * url baseURL
    * def config = karate.read('classpath:AssertionsConfig.json')
    * configure headers = config.headers

  Scenario Outline: Test API with different Request Files
    Given path '/api/users'
    And def createUserPayload = read('classpath:ReadableFiles/RequestFiles/<Request.file>')
    And request createUserPayload
    When method post
    Then status 201
    And def response_data = response
    And match response.data.id == <expectedUserId>
    And match response.data.first_name == <expectedFirstName>
    And match response.data.last_name == <expectedLastName>

      Examples:
      | Request.file     | expectedUserId | expectedFirstName | expectedLastName |
      | createUser1.json |  11            | 'George'          | 'Thomas'         |
      | createUser2.json |  22            | 'Jack'            | 'Ethan'          |
      | createUser3.json |  33            | 'Harry'           | 'Oliver'         |

  Scenario Outline: Validating different Response files
    Given path <path>
    When method Get
    Then status 200
    And print 'Post Response:', response
    And def response_data = response
    And match response_data == read('classpath:ReadableFiles/ResponseFiles/<response_file>')

    Examples:
      | path             |  response_file      |
      | '/api/unknown/2' |  Responsefile1.json |
      | '/api/unknown/3' |  Responsefile2.json |
      | '/api/unknown/4' |  Responsefile3.json |





