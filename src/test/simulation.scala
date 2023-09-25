// working one

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import com.intuit.karate.gatling.PreDef._
import org.joda.time.DurationFieldType.seconds
import org.joda.time.PeriodType.seconds

import java.util.Scanner
import scala.concurrent.duration.DurationInt
import scala.language.postfixOps

class simulation extends Simulation {
  val env= System.getProperty("env")
  printf("Running With This Env --> %s",env)
  println()
  System.setProperty("karate.env", env)

  val httpCnf = http.baseUrl("https://reqres.in")
    .header("value-type", "application/json")
    .header("Content-Type", "application/json")


  // Specify the Karate feature file containing the scenarios
  val path = "classpath:karate/API.feature"


  // Define the Gatling scenario by calling the Karate scenarios
  val scn = scenario("User Scenario")
    .exec(karateFeature("classpath:karate/API.feature"))




  val createScenario = scenario("Create User").exec(karateFeature("classpath:karate/User.feature","@name=Create a new user"))
  val getUserScenario = scenario("Get User").exec(karateFeature("classpath:karate/User.feature","@name=Get user by ID"))
  val updateUserScenario = scenario("Update User").exec(karateFeature("classpath:karate/User.feature","@name=Update user by ID"))
  val deleteUserScenario = scenario("Delete User").exec(karateFeature("classpath:karate/User.feature","@name=Delete user by ID"))


  // Take the condition from the user at runtime

  //Console.println("Run With Throttle --> Enter YES/NO")

  val userInput =System.getProperty("throttle")
  printf("Running With Throttle --> %s",userInput)
  println()


  //Console.println("Enter how many users you want to run with-->")
  val at_once_users=Integer.getInteger("users",1)
  printf("Running With Users --> %d Users",at_once_users)
  println()

  // Console.println("Enter how many minutes you want the scenerios to run -->")
  val minutes_user=Integer.getInteger("time",1)
  printf("Running With  --> %d Minutes",minutes_user)
  println()

  val users =
    if (userInput=="YES") {
      scn.inject(
        rampUsers(at_once_users) during (minutes_user minutes),
        //nothingFor(minutes_user minutes)
        //      rampUsersPerSec(4) to (8) during (5 minutes),
      ).throttle(
        reachRps(10) in (5 seconds), //request per second
        holdFor(20 seconds),
        jumpToRps(5),
        holdFor(10 seconds),
        jumpToRps(8)
      )
    }

    else if (userInput=="NO"){
      scn.inject(
        //nothingFor(minutes_user minutes),
        //maxDuration(at_once_users),
        atOnceUsers(at_once_users)
        //constantUsersPerSec(at_once_users) during (minutes_user minutes)
      )
    }



    else  {
      scn.inject(atOnceUsers(at_once_users))
    }

  setUp(users).maxDuration(minutes_user minutes).protocols(httpCnf)

}

// earlier one
//  setUp(
//    scn.inject(
//      rampUsers(2) during (10 seconds), // : It will injects the no of user distributely on a given duration.
//      nothingFor(5 seconds), // Pause for a given duration
//      constantUsersPerSec(4) during (10 seconds), //users per second, during a given duration. Users will be injected at regular intervals
//      rampUsersPerSec(4) to (8) during (5 minutes), //Injects users from starting rate to target rate, defined in users per second, during a given duration. Users will be injected at regular intervals.
//      nothingFor(5 seconds),
//      atOnceUsers(5), //Injects a given number of users at once.
//      nothingFor(10 seconds),
//      heavisideUsers(10) during (20 seconds) //the target number of users to reach and the duration over which to inject those users.
//    ).throttle(
//      reachRps(10) in (5 seconds), //request per second
//      holdFor(20 seconds),
//      jumpToRps(5),
//      holdFor(10 seconds),
//      jumpToRps(8),
//      holdFor(10 seconds)
//    )
//  ).protocols(httpCnf)

