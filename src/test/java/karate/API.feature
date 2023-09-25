Feature: Create , Get, Update and Delete user using restAPI
  Background:
    * url baseURL
    * def config = karate.read('classpath:AssertionsConfig.json')
    * configure headers = config.headers

  Scenario: Create a new user
    Given path '/api/users'
    And def createUserPayload = read('classpath:ReadableFiles/createUser.json')
    And request createUserPayload
    When method post
    Then status 201
    And match response.data.id == config.expectedUserId
    And match response.data.email == config.expectedEmail
    And match response.data.first_name == config.expectedFirstName
    And match response.data.last_name == config.expectedLastName
    And match response.data.avatar == config.expectedAvatar
    And def createdUser = response.data
    And karate.set('userId', createdUser.id)
    And print 'userId:', createdUser.id
    And print 'Post Response:', response

    # Logging
    And print 'userId:', createdUser.id
    And print 'Post Response:', response

  Scenario: Get user by ID
    Given path '/api/users/2'
    When method get
    Then status 200
    And match response.data.id == config.expectedUserId
    And match response.data.email == config.expectedEmail
    And match response.data.first_name == config.expectedFirstName
    And match response.data.last_name == config.expectedLastName
    And match response.data.avatar == config.expectedAvatar
    And print 'Get Response:', response


  Scenario: Update user by ID
    Given path '/api/users/{userId}'
    And path userId = karate.get('userId')
    And headers { "Content-Type": "application/json" }
    And def updateUserPayload = read('classpath:ReadableFiles/updateUser.json')
    And request { "email": "#(email)", "first_name": "#(first_name)", "last_name": "#(last_name)" }
    When method put
    Then status 200

    #check if the updatedAt field exists in the response and is not null
    And match response.updatedAt != null
    And print 'Put Response:', response


  Scenario: Delete user by ID
    Given path '/api/users/{userId}'
    And path userId = karate.get('userId')
    When method delete
    Then status 204

    # Logging
    And print 'Delete Response:', response





